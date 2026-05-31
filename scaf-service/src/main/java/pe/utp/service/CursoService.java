package pe.utp.service;

import org.springframework.data.domain.Pageable;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.curso.CursoRequestDto;
import pe.utp.dto.curso.CursoResponseDto;

public interface CursoService {

    PaginateResponseDto<CursoResponseDto> listar(Pageable pageable);

    CursoResponseDto buscarPorId(Long id);

    CursoResponseDto crear(CursoRequestDto cursoRequestDto);

    CursoResponseDto actualizar(Long id, CursoRequestDto cursoRequestDto);

    void eliminar(Long id);
}
