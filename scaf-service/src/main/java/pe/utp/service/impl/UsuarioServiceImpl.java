package pe.utp.service.impl;

import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pe.utp.dto.UsuarioRequestDto;
import pe.utp.dto.UsuarioResponseDto;
import pe.utp.repository.CarreraRepository;
import pe.utp.repository.RolRepository;
import pe.utp.repository.UsuarioRepository;
import pe.utp.repository.model.Carrera;
import pe.utp.repository.model.Rol;
import pe.utp.repository.model.Usuario;
import pe.utp.service.UsuarioService;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final CarreraRepository carreraRepository;

    @Override
    public Page<UsuarioResponseDto> listar(Pageable pageable) {
        return usuarioRepository.findAll(pageable)
                .map(this::toResponseDto);
    }

    @Override
    public Optional<UsuarioResponseDto> buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .map(this::toResponseDto);
    }

    @Override
    public UsuarioResponseDto crear(UsuarioRequestDto usuarioRequestDto) {
        Usuario usuario = new Usuario();
        actualizarDatosUsuario(usuario, usuarioRequestDto);
        return toResponseDto(usuarioRepository.save(usuario));
    }

    @Override
    public Optional<UsuarioResponseDto> actualizar(Long id, UsuarioRequestDto usuarioRequestDto) {
        return usuarioRepository.findById(id)
                .map(usuarioExistente -> {
                    actualizarDatosUsuario(usuarioExistente, usuarioRequestDto);
                    return toResponseDto(usuarioRepository.save(usuarioExistente));
                });
    }

    @Override
    public boolean eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            return false;
        }
        usuarioRepository.deleteById(id);
        return true;
    }

    private void actualizarDatosUsuario(Usuario usuario, UsuarioRequestDto usuarioRequestDto) {
        usuario.setNombres(usuarioRequestDto.getNombres());
        usuario.setApellidos(usuarioRequestDto.getApellidos());
        usuario.setCodigoUniversitario(usuarioRequestDto.getCodigoUniversitario());
        usuario.setCorreoInstitucional(usuarioRequestDto.getCorreoInstitucional());
        usuario.setPassword(usuarioRequestDto.getPassword());
        usuario.setEstado(usuarioRequestDto.getEstado());
        usuario.setTelefono(usuarioRequestDto.getTelefono());
        usuario.setRol(buscarRol(usuarioRequestDto.getCodigoRol()));
        usuario.setFotoUsuario(usuarioRequestDto.getFotoUsuario());
        usuario.setCarrera(buscarCarrera(usuarioRequestDto.getCodigoCarrera()));
    }

    private Rol buscarRol(Long codigoRol) {
        if (codigoRol == null) {
            return null;
        }
        return rolRepository.findById(codigoRol)
                .orElseThrow(() -> new IllegalArgumentException("No existe el rol con codigo " + codigoRol));
    }

    private Carrera buscarCarrera(Long codigoCarrera) {
        if (codigoCarrera == null) {
            return null;
        }
        return carreraRepository.findById(codigoCarrera)
                .orElseThrow(() -> new IllegalArgumentException("No existe la carrera con codigo " + codigoCarrera));
    }

    private UsuarioResponseDto toResponseDto(Usuario usuario) {
        UsuarioResponseDto usuarioResponseDto = new UsuarioResponseDto();
        usuarioResponseDto.setCodigoUsuario(usuario.getCodigoUsusario());
        usuarioResponseDto.setNombres(usuario.getNombres());
        usuarioResponseDto.setApellidos(usuario.getApellidos());
        usuarioResponseDto.setCodigoUniversitario(usuario.getCodigoUniversitario());
        usuarioResponseDto.setCorreoInstitucional(usuario.getCorreoInstitucional());
        usuarioResponseDto.setTelefono(usuario.getTelefono());
        usuarioResponseDto.setFotoUsuario(usuario.getFotoUsuario());
        usuarioResponseDto.setEstado(usuario.getEstado());

        if (usuario.getRol() != null) {
            usuarioResponseDto.setCodigoRol(usuario.getRol().getCodigoRol());
            usuarioResponseDto.setNombreRol(usuario.getRol().getNombreRol());
        }

        if (usuario.getCarrera() != null) {
            usuarioResponseDto.setCodigoCarrera(usuario.getCarrera().getCodigoCarrera());
            usuarioResponseDto.setNombreCarrera(usuario.getCarrera().getNombreCarrera());
        }

        return usuarioResponseDto;
    }
}
