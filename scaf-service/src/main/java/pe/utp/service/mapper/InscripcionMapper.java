package pe.utp.service.mapper;

import org.springframework.stereotype.Component;
import pe.utp.dto.inscripcion.InscripcionResponseDto;
import pe.utp.repository.model.Asignacion;
import pe.utp.repository.model.Inscripcion;
import pe.utp.repository.model.Usuario;

@Component
public class InscripcionMapper {

    public void actualizarEntidad(Inscripcion inscripcion, Usuario estudiante, Asignacion asignacion) {
        inscripcion.setEstudiante(estudiante);
        inscripcion.setAsignacion(asignacion);
    }

    public InscripcionResponseDto toResponseDto(Inscripcion inscripcion) {
        InscripcionResponseDto dto = new InscripcionResponseDto();
        dto.setCodigoInscripcion(inscripcion.getCodigoInscripcion());

        if (inscripcion.getEstudiante() != null) {
            dto.setCodigoEstudiante(inscripcion.getEstudiante().getCodigoUsusario());
            dto.setNombreEstudiante(
                    inscripcion.getEstudiante().getNombres() + " " + inscripcion.getEstudiante().getApellidos());
        }

        Asignacion asignacion = inscripcion.getAsignacion();
        if (asignacion != null) {
            dto.setCodigoAsignacion(asignacion.getCodigoAsignacion());

            if (asignacion.getCurso() != null) {
                dto.setNombreCurso(asignacion.getCurso().getNombre());
                dto.setCreditosCurso(asignacion.getCurso().getCreditos());
            }

            if (asignacion.getDocente() != null) {
                dto.setNombreDocente(
                        asignacion.getDocente().getNombres() + " " + asignacion.getDocente().getApellidos());
            }

            if (asignacion.getHorario() != null) {
                dto.setDia(asignacion.getHorario().getDia());
                dto.setHoraInicio(asignacion.getHorario().getHoraInicio());
                dto.setHoraFin(asignacion.getHorario().getHoraFin());
                dto.setAula(asignacion.getHorario().getAula());
            }

            if (asignacion.getCicloAcademico() != null) {
                dto.setDescripcionCiclo(asignacion.getCicloAcademico().getDescripcion());
            }
        }

        return dto;
    }
}
