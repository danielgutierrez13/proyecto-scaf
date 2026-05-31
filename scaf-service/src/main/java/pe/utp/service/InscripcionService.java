package pe.utp.service;

import org.springframework.data.domain.Pageable;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.inscripcion.InscripcionRequestDto;
import pe.utp.dto.inscripcion.InscripcionResponseDto;

public interface InscripcionService {

    PaginateResponseDto<InscripcionResponseDto> listar(Pageable pageable);

    InscripcionResponseDto buscarPorId(Long id);

    InscripcionResponseDto crear(InscripcionRequestDto inscripcionRequestDto);

    InscripcionResponseDto actualizar(Long id, InscripcionRequestDto inscripcionRequestDto);

    void eliminar(Long id);
}
