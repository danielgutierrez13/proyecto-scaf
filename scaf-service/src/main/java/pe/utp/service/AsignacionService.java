package pe.utp.service;

import org.springframework.data.domain.Pageable;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.asignacion.AsignacionRequestDto;
import pe.utp.dto.asignacion.AsignacionResponseDto;

public interface AsignacionService {

    PaginateResponseDto<AsignacionResponseDto> listar(Pageable pageable);

    AsignacionResponseDto buscarPorId(Long id);

    AsignacionResponseDto crear(AsignacionRequestDto asignacionRequestDto);

    AsignacionResponseDto actualizar(Long id, AsignacionRequestDto asignacionRequestDto);

    void eliminar(Long id);
}
