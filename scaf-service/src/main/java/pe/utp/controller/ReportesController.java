package pe.utp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utp.dto.reporte.ReporteCursoDto;
import pe.utp.dto.reporte.ReporteEstudianteDto;
import pe.utp.repository.AsignacionRepository;
import pe.utp.repository.AsistenciaRepository;
import pe.utp.repository.InscripcionRepository;
import pe.utp.repository.model.Asignacion;
import pe.utp.repository.model.Inscripcion;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reportes")
public class ReportesController {

    private static final int SESIONES_POR_CICLO = 18;

    private final AsignacionRepository  asignacionRepository;
    private final InscripcionRepository inscripcionRepository;
    private final AsistenciaRepository  asistenciaRepository;

    @GetMapping("/asistencias")
    @ResponseStatus(HttpStatus.OK)
    public List<ReporteCursoDto> reporteAsistencias() {
        List<Asignacion> asignaciones = asignacionRepository.findByCicloAcademico_VigenteTrue();

        return asignaciones.stream().map(asig -> {
            List<Inscripcion> inscritos = inscripcionRepository.findByAsignacion_CodigoAsignacion(
                    asig.getCodigoAsignacion());

            List<ReporteEstudianteDto> estudiantes = inscritos.stream().map(ins -> {
                long asistencias = asistenciaRepository.countByUsuario_CodigoUsusarioAndAsignacion_CodigoAsignacion(
                        ins.getEstudiante().getCodigoUsusario(), asig.getCodigoAsignacion());
                int pct = (int) Math.min(100, Math.round((asistencias * 100.0) / SESIONES_POR_CICLO));
                String nombre = ins.getEstudiante().getNombres() + " " + ins.getEstudiante().getApellidos();
                return new ReporteEstudianteDto(
                        ins.getEstudiante().getCodigoUsusario(),
                        nombre,
                        ins.getEstudiante().getCodigoUniversitario(),
                        asistencias,
                        SESIONES_POR_CICLO,
                        pct);
            }).toList();

            String docente = asig.getDocente().getNombres() + " " + asig.getDocente().getApellidos();
            return new ReporteCursoDto(
                    asig.getCodigoAsignacion(),
                    asig.getCurso().getNombre(),
                    docente,
                    asig.getHorario().getDia(),
                    asig.getHorario().getHoraInicio(),
                    asig.getHorario().getHoraFin(),
                    asig.getHorario().getAula(),
                    asig.getCicloAcademico().getDescripcion(),
                    estudiantes);
        }).toList();
    }
}
