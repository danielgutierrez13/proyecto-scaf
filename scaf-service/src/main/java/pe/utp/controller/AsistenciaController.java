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
import pe.utp.dto.asistencia.ReconocimientoRequestDto;
import pe.utp.dto.asistencia.ReconocimientoResponseDto;
import pe.utp.repository.model.Usuario;
import pe.utp.service.AsistenciaService;
import pe.utp.service.RostroService;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/asistencias")
public class AsistenciaController {

    private final AsistenciaService asistenciaService;
    private final RostroService rostroService;

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

    /**
     * Recibe un frame de la cÃ¡mara, identifica al estudiante con LBPH
     * y registra su asistencia automÃ¡ticamente.
     */
    @PostMapping("/reconocer")
    @ResponseStatus(HttpStatus.OK)
    public ReconocimientoResponseDto reconocer(@RequestBody ReconocimientoRequestDto request) throws IOException {
        byte[] bytes = Base64.getDecoder().decode(request.getImagenBase64());

        Optional<Usuario> reconocido = rostroService.reconocerEstudiante(
                request.getCodigoAsignacion(), bytes);

        if (reconocido.isEmpty()) {
            return new ReconocimientoResponseDto("NO_RECONOCIDO", "Rostro no reconocido.", null, null, null);
        }

        Usuario estudiante = reconocido.get();
        String horaIngreso = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));

        // Registrar asistencia automÃ¡ticamente
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
}
