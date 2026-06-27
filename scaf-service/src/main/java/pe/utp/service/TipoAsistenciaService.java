package pe.utp.service;

import org.springframework.data.domain.Pageable;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.tipoAsistencia.TipoAsistenciaRequestDto;
import pe.utp.dto.tipoAsistencia.TipoAsistenciaResponseDto;

public interface TipoAsistenciaService {

    PaginateResponseDto<TipoAsistenciaResponseDto> listar(Pageable pageable);

    TipoAsistenciaResponseDto buscarPorId(Long id);

    TipoAsistenciaResponseDto crear(TipoAsistenciaRequestDto tipoAsistenciaRequestDto);

    TipoAsistenciaResponseDto actualizar(Long id, TipoAsistenciaRequestDto tipoAsistenciaRequestDto);

    void eliminar(Long id);
}
