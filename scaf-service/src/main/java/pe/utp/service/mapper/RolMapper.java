package pe.utp.service.mapper;

import org.springframework.stereotype.Component;
import pe.utp.dto.rol.RolRequestDto;
import pe.utp.dto.rol.RolResponseDto;
import pe.utp.repository.model.Rol;

@Component
public class RolMapper {

    public void actualizarEntidad(Rol rol, RolRequestDto requestDto) {
        rol.setNombreRol(requestDto.getNombreRol());
        rol.setDescripcion(requestDto.getDescripcion());
    }

    public RolResponseDto toResponseDto(Rol rol) {
        RolResponseDto responseDto = new RolResponseDto();
        responseDto.setCodigoRol(rol.getCodigoRol());
        responseDto.setNombreRol(rol.getNombreRol());
        responseDto.setDescripcion(rol.getDescripcion());

        return responseDto;
    }
}
