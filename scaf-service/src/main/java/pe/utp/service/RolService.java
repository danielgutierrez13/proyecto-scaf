package pe.utp.service;

import org.springframework.data.domain.Pageable;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.rol.RolRequestDto;
import pe.utp.dto.rol.RolResponseDto;

public interface RolService {

    PaginateResponseDto<RolResponseDto> listar(Pageable pageable);

    RolResponseDto buscarPorId(Long id);

    RolResponseDto crear(RolRequestDto rolRequestDto);

    RolResponseDto actualizar(Long id, RolRequestDto rolRequestDto);

    void eliminar(Long id);
}
