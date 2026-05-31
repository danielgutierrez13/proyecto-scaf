package pe.utp.service.mapper;

import org.springframework.stereotype.Component;
import pe.utp.dto.usuario.UsuarioRequestDto;
import pe.utp.dto.usuario.UsuarioResponseDto;
import pe.utp.repository.model.Carrera;
import pe.utp.repository.model.Rol;
import pe.utp.repository.model.Usuario;

@Component
public class UsuarioMapper {

    public void actualizarEntidad(Usuario usuario, UsuarioRequestDto requestDto, Rol rol, Carrera carrera) {
        usuario.setNombres(requestDto.getNombres());
        usuario.setApellidos(requestDto.getApellidos());
        usuario.setCodigoUniversitario(requestDto.getCodigoUniversitario());
        usuario.setCorreoInstitucional(requestDto.getCorreoInstitucional());
        usuario.setPassword(requestDto.getPassword());
        usuario.setEstado(requestDto.getEstado());
        usuario.setTelefono(requestDto.getTelefono());
        usuario.setRol(rol);
        usuario.setFotoUsuario(requestDto.getFotoUsuario());
        usuario.setCarrera(carrera);
    }

    public UsuarioResponseDto toResponseDto(Usuario usuario) {
        UsuarioResponseDto responseDto = new UsuarioResponseDto();
        responseDto.setCodigoUsuario(usuario.getCodigoUsusario());
        responseDto.setNombres(usuario.getNombres());
        responseDto.setApellidos(usuario.getApellidos());
        responseDto.setCodigoUniversitario(usuario.getCodigoUniversitario());
        responseDto.setCorreoInstitucional(usuario.getCorreoInstitucional());
        responseDto.setTelefono(usuario.getTelefono());
        responseDto.setFotoUsuario(usuario.getFotoUsuario());
        responseDto.setEstado(usuario.getEstado());

        if (usuario.getRol() != null) {
            responseDto.setCodigoRol(usuario.getRol().getCodigoRol());
            responseDto.setNombreRol(usuario.getRol().getNombreRol());
        }

        if (usuario.getCarrera() != null) {
            responseDto.setCodigoCarrera(usuario.getCarrera().getCodigoCarrera());
            responseDto.setNombreCarrera(usuario.getCarrera().getNombreCarrera());
        }

        return responseDto;
    }
}
