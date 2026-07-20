package pe.utp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.asistencia.AsistenciaRequestDto;
import pe.utp.dto.asistencia.AsistenciaResponseDto;
import pe.utp.dto.asistencia.AsistentesHoyDto;
import pe.utp.dto.asistencia.ReconocimientoRequestDto;
import pe.utp.dto.asistencia.ReconocimientoResponseDto;
import pe.utp.repository.AsignacionRepository;
import pe.utp.repository.AsistenciaRepository;
import pe.utp.repository.model.Asignacion;
import pe.utp.repository.model.Usuario;
import pe.utp.service.AsistenciaService;
import pe.utp.service.RostroService;

import java.io.IOException;
import java.text.Normalizer;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/asistencias")
public class AsistenciaController {

    private final AsistenciaService     asistenciaService;
    private final AsistenciaRepository  asistenciaRepository;
    private final AsignacionRepository  asignacionRepository;
    private final RostroService         rostroService;

    private static final Map<DayOfWeek, String> DIAS_ES = Map.of(
            DayOfWeek.MONDAY,    "Lunes",
            DayOfWeek.TUESDAY,   "Martes",
            DayOfWeek.WEDNESDAY, "Miércoles",
            DayOfWeek.THURSDAY,  "Jueves",
            DayOfWeek.FRIDAY,    "Viernes",
            DayOfWeek.SATURDAY,  "Sábado",
            DayOfWeek.SUNDAY,    "Domingo"
    );

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public PaginateResponseDto<AsistenciaResponseDto> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return asistenciaService.listar(pageable);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public AsistenciaResponseDto buscarPorId(@PathVariable Long id) {
        return asistenciaService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AsistenciaResponseDto crear(@Valid @RequestBody AsistenciaRequestDto asistenciaRequestDto) {
        return asistenciaService.crear(asistenciaRequestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public AsistenciaResponseDto actualizar(
            @PathVariable Long id,
            @Valid @RequestBody AsistenciaRequestDto asistenciaRequestDto
    ) {
        return asistenciaService.actualizar(id, asistenciaRequestDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        asistenciaService.eliminar(id);
    }

    /** Lista los estudiantes que ya asistieron hoy a una asignación. */
    @GetMapping("/asignacion/{codigoAsignacion}/hoy")
    @ResponseStatus(HttpStatus.OK)
    public List<AsistentesHoyDto> asistentesHoy(@PathVariable Long codigoAsignacion) {
        return asistenciaRepository
                .findByAsignacion_CodigoAsignacionAndFecha(codigoAsignacion, LocalDate.now())
                .stream()
                .map(a -> new AsistentesHoyDto(
                        a.getUsuario().getCodigoUsusario(),
                        a.getUsuario().getNombres() + " " + a.getUsuario().getApellidos(),
                        a.getUsuario().getCodigoUniversitario(),
                        a.getHoraIngreso()
                ))
                .toList();
    }

    /**
     * Recibe un frame de la cámara, valida día/hora/duplicado,
     * identifica al estudiante con LBPH y registra su asistencia.
     */
    @PostMapping("/reconocer")
    @ResponseStatus(HttpStatus.OK)
    public ReconocimientoResponseDto reconocer(@RequestBody ReconocimientoRequestDto request) throws IOException {

        // 1. Cargar la asignación
        Asignacion asignacion = asignacionRepository.findById(request.getCodigoAsignacion())
                .orElse(null);
        if (asignacion == null) {
            return new ReconocimientoResponseDto("ERROR", "Asignación no encontrada.", null, null, null);
        }

        // 2. Validar que hoy sea el día de la clase
        String diaHoy   = DIAS_ES.get(LocalDate.now().getDayOfWeek());
        String diaClase = asignacion.getHorario().getDia();
        if (!sinAcentos(diaHoy).equalsIgnoreCase(sinAcentos(diaClase))) {
            return new ReconocimientoResponseDto(
                    "NO_ES_DIA_DE_CLASE",
                    "Hoy no corresponde a este curso. La clase es los " + diaClase + ".",
                    null, null, null
            );
        }

        // 3. Validar que estemos dentro del horario (con 15 min antes y 30 min después)
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm");
        LocalTime inicio  = LocalTime.parse(asignacion.getHorario().getHoraInicio(), fmt).minusMinutes(15);
        LocalTime fin     = LocalTime.parse(asignacion.getHorario().getHoraFin(), fmt).plusMinutes(30);
        LocalTime ahora   = LocalTime.now();

        if (ahora.isBefore(inicio) || ahora.isAfter(fin)) {
            return new ReconocimientoResponseDto(
                    "FUERA_DE_HORARIO",
                    "El registro de asistencia es de " +
                    asignacion.getHorario().getHoraInicio() + " a " +
                    asignacion.getHorario().getHoraFin() + ".",
                    null, null, null
            );
        }

        // 4. Reconocer al estudiante
        byte[] bytes = Base64.getDecoder().decode(request.getImagenBase64());
        Optional<Usuario> reconocido = rostroService.reconocerEstudiante(request.getCodigoAsignacion(), bytes);

        if (reconocido.isEmpty()) {
            return new ReconocimientoResponseDto("NO_RECONOCIDO", "Rostro no reconocido.", null, null, null);
        }

        Usuario estudiante = reconocido.get();

        // 5. Validar asistencia duplicada
        boolean yaRegistrado = asistenciaRepository
                .existsByUsuario_CodigoUsusarioAndAsignacion_CodigoAsignacionAndFecha(
                        estudiante.getCodigoUsusario(), request.getCodigoAsignacion(), LocalDate.now());

        if (yaRegistrado) {
            return new ReconocimientoResponseDto(
                    "YA_REGISTRADO",
                    estudiante.getNombres() + " " + estudiante.getApellidos() + " ya registró asistencia hoy.",
                    estudiante.getCodigoUsusario(),
                    estudiante.getNombres() + " " + estudiante.getApellidos(),
                    null
            );
        }

        // 6. Registrar asistencia
        String horaIngreso = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        AsistenciaRequestDto asistenciaDto = new AsistenciaRequestDto();
        asistenciaDto.setCodigoUsuario(estudiante.getCodigoUsusario());
        asistenciaDto.setCodigoAsignacion(request.getCodigoAsignacion());
        asistenciaDto.setFecha(LocalDate.now());
        asistenciaDto.setHoraIngreso(horaIngreso);
        asistenciaDto.setEstado(true);
        asistenciaService.crear(asistenciaDto);

        return new ReconocimientoResponseDto(
                "RECONOCIDO",
                "Asistencia registrada correctamente.",
                estudiante.getCodigoUsusario(),
                estudiante.getNombres() + " " + estudiante.getApellidos(),
                horaIngreso
        );
    }

    /** Elimina acentos/diacríticos para comparar días sin importar tildes. */
    private static String sinAcentos(String s) {
        if (s == null) return "";
        return Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    }
}
