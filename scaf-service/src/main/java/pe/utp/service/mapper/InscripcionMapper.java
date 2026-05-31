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
        InscripcionResponseDto responseDto = new InscripcionResponseDto();
        responseDto.setCodigoInscripcion(inscripcion.getCodigoInscripcion());

        if (inscripcion.getEstudiante() != null) {
            responseDto.setCodigoEstudiante(inscripcion.getEstudiante().getCodigoUsusario());
            responseDto.setNombreEstudiante(inscripcion.getEstudiante().getNombres());
        }

        if (inscripcion.getAsignacion() != null) {
            responseDto.setCodigoAsignacion(inscripcion.getAsignacion().getCodigoAsignacion());
            if (inscripcion.getAsignacion().getCurso() != null) {
                responseDto.setNombreCurso(inscripcion.getAsignacion().getCurso().getNombre());
            }
        }

        return responseDto;
    }
}
