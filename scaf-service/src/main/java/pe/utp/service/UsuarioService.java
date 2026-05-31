package pe.utp.service;

import org.springframework.data.domain.Pageable;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.usuario.UsuarioRequestDto;
import pe.utp.dto.usuario.UsuarioResponseDto;

public interface UsuarioService {

    PaginateResponseDto<UsuarioResponseDto> listar(Pageable pageable);

    UsuarioResponseDto buscarPorId(Long id);

    UsuarioResponseDto crear(UsuarioRequestDto usuarioRequestDto);

    UsuarioResponseDto actualizar(Long id, UsuarioRequestDto usuarioRequestDto);

    void eliminar(Long id);
}
