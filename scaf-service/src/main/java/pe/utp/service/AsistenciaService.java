package pe.utp.service;

import org.springframework.data.domain.Pageable;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.asistencia.AsistenciaRequestDto;
import pe.utp.dto.asistencia.AsistenciaResponseDto;

public interface AsistenciaService {

    PaginateResponseDto<AsistenciaResponseDto> listar(Pageable pageable);

    AsistenciaResponseDto buscarPorId(Long id);

    AsistenciaResponseDto crear(AsistenciaRequestDto asistenciaRequestDto);

    AsistenciaResponseDto actualizar(Long id, AsistenciaRequestDto asistenciaRequestDto);

    void eliminar(Long id);
}
