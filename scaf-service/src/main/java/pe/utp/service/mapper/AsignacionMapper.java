package pe.utp.service.mapper;

import org.springframework.stereotype.Component;
import pe.utp.dto.asignacion.AsignacionResponseDto;
import pe.utp.repository.model.Asignacion;
import pe.utp.repository.model.CicloAcademico;
import pe.utp.repository.model.Curso;
import pe.utp.repository.model.Horario;
import pe.utp.repository.model.Usuario;

@Component
public class AsignacionMapper {

    public void actualizarEntidad(
            Asignacion asignacion,
            Usuario docente,
            Curso curso,
            Horario horario,
            CicloAcademico cicloAcademico
    ) {
        asignacion.setDocente(docente);
        asignacion.setCurso(curso);
        asignacion.setHorario(horario);
        asignacion.setCicloAcademico(cicloAcademico);
    }

    public AsignacionResponseDto toResponseDto(Asignacion asignacion) {
        AsignacionResponseDto responseDto = new AsignacionResponseDto();
        responseDto.setCodigoAsignacion(asignacion.getCodigoAsignacion());

        if (asignacion.getDocente() != null) {
            responseDto.setCodigoDocente(asignacion.getDocente().getCodigoUsusario());
            responseDto.setNombreDocente(asignacion.getDocente().getNombres());
        }

        if (asignacion.getCurso() != null) {
            responseDto.setCodigoCurso(asignacion.getCurso().getCodigoCurso());
            responseDto.setNombreCurso(asignacion.getCurso().getNombre());
        }

        if (asignacion.getHorario() != null) {
            responseDto.setCodigoHorario(asignacion.getHorario().getCodigoHorario());
            responseDto.setDiaHorario(asignacion.getHorario().getDia());
        }

        if (asignacion.getCicloAcademico() != null) {
            responseDto.setCodigoCicloAcademico(asignacion.getCicloAcademico().getCodigoCicloAcademico());
            responseDto.setDescripcionCicloAcademico(asignacion.getCicloAcademico().getDescripcion());
        }

        return responseDto;
    }
}
