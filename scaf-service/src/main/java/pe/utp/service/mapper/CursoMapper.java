package pe.utp.service.mapper;

import org.springframework.stereotype.Component;
import pe.utp.dto.curso.CursoRequestDto;
import pe.utp.dto.curso.CursoResponseDto;
import pe.utp.repository.model.Curso;

@Component
public class CursoMapper {

    public void actualizarEntidad(Curso curso, CursoRequestDto requestDto) {
        curso.setNombre(requestDto.getNombre());
        curso.setCreditos(requestDto.getCreditos());
        curso.setCiclo(requestDto.getCiclo());
        curso.setModalidad(requestDto.getModalidad());
    }

    public CursoResponseDto toResponseDto(Curso curso) {
        CursoResponseDto responseDto = new CursoResponseDto();
        responseDto.setCodigoCurso(curso.getCodigoCurso());
        responseDto.setNombre(curso.getNombre());
        responseDto.setCreditos(curso.getCreditos());
        responseDto.setCiclo(curso.getCiclo());
        responseDto.setModalidad(curso.getModalidad());
        return responseDto;
    }
}
