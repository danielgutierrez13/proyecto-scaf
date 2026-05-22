package pe.utp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioRequestDto {

    private String nombres;
    private String apellidos;
    private String codigoUniversitario;
    private String correoInstitucional;
    private String password;
    private String telefono;
    private Long codigoRol;
    private String fotoUsuario;
    private Long codigoCarrera;
    private Boolean estado;
}
