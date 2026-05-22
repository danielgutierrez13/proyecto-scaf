package pe.utp.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pe.utp.dto.UsuarioRequestDto;
import pe.utp.dto.UsuarioResponseDto;

public interface UsuarioService {

    Page<UsuarioResponseDto> listar(Pageable pageable);

    Optional<UsuarioResponseDto> buscarPorId(Long id);

    UsuarioResponseDto crear(UsuarioRequestDto usuarioRequestDto);

    Optional<UsuarioResponseDto> actualizar(Long id, UsuarioRequestDto usuarioRequestDto);

    boolean eliminar(Long id);
}
