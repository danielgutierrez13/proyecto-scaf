package pe.utp.service.mapper;

import org.springframework.stereotype.Component;
import pe.utp.dto.tipoAsistencia.TipoAsistenciaRequestDto;
import pe.utp.dto.tipoAsistencia.TipoAsistenciaResponseDto;
import pe.utp.repository.model.TipoAsistencia;

@Component
public class TipoAsistenciaMapper {

    public void actualizarEntidad(TipoAsistencia tipoAsistencia, TipoAsistenciaRequestDto requestDto) {
        tipoAsistencia.setNombre(requestDto.getNombre());
        tipoAsistencia.setDescripcion(requestDto.getDescripcion());
    }

    public TipoAsistenciaResponseDto toResponseDto(TipoAsistencia tipoAsistencia) {
        TipoAsistenciaResponseDto responseDto = new TipoAsistenciaResponseDto();
        responseDto.setCodigoTipoAsistencia(tipoAsistencia.getCodigoTipoAsistencia());
        responseDto.setNombre(tipoAsistencia.getNombre());
        responseDto.setDescripcion(tipoAsistencia.getDescripcion());
        return responseDto;
    }
}
