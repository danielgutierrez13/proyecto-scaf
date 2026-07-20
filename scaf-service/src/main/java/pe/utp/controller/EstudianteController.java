package pe.utp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utp.dto.asistencia.AsistenciaResumenDto;
import pe.utp.dto.inscripcion.InscripcionResponseDto;
import pe.utp.repository.AsignacionRepository;
import pe.utp.repository.AsistenciaRepository;
import pe.utp.repository.InscripcionRepository;
import pe.utp.repository.model.Asignacion;
import pe.utp.repository.model.Inscripcion;
import pe.utp.service.RostroService;
import pe.utp.service.mapper.InscripcionMapper;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/estudiante")
public class EstudianteController {

    private final InscripcionRepository inscripcionRepository;
    private final AsignacionRepository asignacionRepository;
    private final AsistenciaRepository asistenciaRepository;
    private final InscripcionMapper inscripcionMapper;
    private final RostroService rostroService;

    /** Todos los cursos del estudiante (ciclos actuales y anteriores). */
    @GetMapping("/{codigoEstudiante}/cursos")
    @ResponseStatus(HttpStatus.OK)
    public List<InscripcionResponseDto> misCursos(@PathVariable Long codigoEstudiante) {
        return inscripcionRepository
                .findByEstudiante_CodigoUsusario(codigoEstudiante)
                .stream()
                .map(inscripcionMapper::toResponseDto)
                .toList();
    }

    /** Cursos del ciclo vigente (para el horario semanal). */
    @GetMapping("/{codigoEstudiante}/horario")
    @ResponseStatus(HttpStatus.OK)
    public List<InscripcionResponseDto> miHorario(@PathVariable Long codigoEstudiante) {
        return inscripcionRepository
                .findByEstudiante_CodigoUsusarioAndAsignacion_CicloAcademico_VigenteTrue(codigoEstudiante)
                .stream()
                .map(inscripcionMapper::toResponseDto)
                .toList();
    }

    /**
     * Asignaciones disponibles del ciclo vigente en las que el estudiante
     * todavÃ­a no estÃ¡ inscrito (para que el admin lo pueda inscribir).
     */
    @GetMapping("/{codigoEstudiante}/disponibles")
    @ResponseStatus(HttpStatus.OK)
    public List<InscripcionResponseDto> disponibles(@PathVariable Long codigoEstudiante) {
        List<Asignacion> vigentes = asignacionRepository.findByCicloAcademico_VigenteTrue();

        return vigentes.stream()
                .filter(a -> !inscripcionRepository.existsByEstudiante_CodigoUsusarioAndAsignacion_CodigoAsignacion(
                        codigoEstudiante, a.getCodigoAsignacion()))
                .map(a -> {
                    Inscripcion dummy = new Inscripcion();
                    dummy.setAsignacion(a);
                    return inscripcionMapper.toResponseDto(dummy);
                })
                .toList();
    }

    /** Resumen de asistencias por curso del estudiante con porcentaje. */
    @GetMapping("/{codigoEstudiante}/asistencias")
    @ResponseStatus(HttpStatus.OK)
    public List<AsistenciaResumenDto> misAsistencias(@PathVariable Long codigoEstudiante) {
        final int SESIONES_POR_CICLO = 18;
        var todas = asistenciaRepository.findByUsuario_CodigoUsusario(codigoEstudiante);
        return todas.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getAsignacion().getCodigoAsignacion()
                ))
                .entrySet().stream()
                .map(entry -> {
                    var asignacion   = entry.getValue().get(0).getAsignacion();
                    long asistencias = entry.getValue().size();
                    int porcentaje   = (int) Math.min(100, Math.round((asistencias * 100.0) / SESIONES_POR_CICLO));
                    return new AsistenciaResumenDto(
                            asignacion.getCodigoAsignacion(),
                            asignacion.getCurso().getNombre(),
                            asignacion.getHorario().getDia(),
                            asignacion.getHorario().getHoraInicio(),
                            asignacion.getHorario().getHoraFin(),
                            asignacion.getHorario().getAula(),
                            asistencias,
                            SESIONES_POR_CICLO,
                            porcentaje
                    );
                })
                .toList();
    }

    /** Verifica si el estudiante tiene fotos de rostro registradas. */
    @GetMapping("/{codigoUniversitario}/tiene-rostro")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, Boolean> tieneRostro(@PathVariable String codigoUniversitario) {
        return Map.of("tieneRostro", rostroService.tieneRostrosRegistrados(codigoUniversitario));
    }
}
