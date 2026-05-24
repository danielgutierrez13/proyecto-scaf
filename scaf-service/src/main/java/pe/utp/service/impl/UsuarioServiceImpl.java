package pe.utp.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.usuario.UsuarioRequestDto;
import pe.utp.dto.usuario.UsuarioResponseDto;
import pe.utp.service.mapper.UsuarioMapper;
import pe.utp.repository.CarreraRepository;
import pe.utp.repository.RolRepository;
import pe.utp.repository.UsuarioRepository;
import pe.utp.repository.model.Carrera;
import pe.utp.repository.model.Rol;
import pe.utp.repository.model.Usuario;
import pe.utp.service.UsuarioService;
import pe.utp.service.exception.CodigoError;
import pe.utp.service.exception.ScafException;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final CarreraRepository carreraRepository;
    private final UsuarioMapper usuarioMapper;

    @Override
    public PaginateResponseDto<UsuarioResponseDto> listar(Pageable pageable) {
        Page<UsuarioResponseDto> pagina = usuarioRepository.findAll(pageable)
                .map(usuarioMapper::toResponseDto);

        return new PaginateResponseDto<>(
                pagina.getContent(),
                pagina.getTotalElements(),
                pagina.getTotalPages(),
                pagina.getNumber()
        );
    }

    @Override
    public UsuarioResponseDto buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(usuarioMapper::toResponseDto)
                .orElseThrow(() -> ScafException.of(CodigoError.USUARIO_NO_ENCONTRADO));
    }

    @Override
    public UsuarioResponseDto crear(UsuarioRequestDto usuarioRequestDto) {
        Usuario usuario = new Usuario();
        Rol rol = buscarRol(usuarioRequestDto.getCodigoRol());
        Carrera carrera = buscarCarrera(usuarioRequestDto.getCodigoCarrera());
        usuarioMapper.actualizarEntidad(usuario, usuarioRequestDto, rol, carrera);
        return usuarioMapper.toResponseDto(usuarioRepository.save(usuario));
    }

    @Override
    public UsuarioResponseDto actualizar(Long id, UsuarioRequestDto usuarioRequestDto) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> ScafException.of(CodigoError.USUARIO_NO_ENCONTRADO));
        Rol rol = buscarRol(usuarioRequestDto.getCodigoRol());
        Carrera carrera = buscarCarrera(usuarioRequestDto.getCodigoCarrera());
        usuarioMapper.actualizarEntidad(usuarioExistente, usuarioRequestDto, rol, carrera);
        return usuarioMapper.toResponseDto(usuarioRepository.save(usuarioExistente));
    }

    @Override
    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw ScafException.of(CodigoError.USUARIO_NO_ENCONTRADO);
        }
        usuarioRepository.deleteById(id);
    }

    private Rol buscarRol(Long codigoRol) {
        if (codigoRol == null) {
            return null;
        }
        return rolRepository.findById(codigoRol)
                .orElseThrow(() -> ScafException.of(CodigoError.USUARIO_ROL_NO_ENCONTRADO));
    }

    private Carrera buscarCarrera(Long codigoCarrera) {
        if (codigoCarrera == null) {
            return null;
        }
        return carreraRepository.findById(codigoCarrera)
                .orElseThrow(() -> ScafException.of(CodigoError.USUARIO_CARRERA_NO_ENCONTRADA));
    }
}