package pe.utp.dto.auth;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponseDto {
    private Long codigoUsuario;
    private String nombres;
    private String apellidos;
    private String correoInstitucional;
    private String codigoUniversitario;
    private String nombreRol;
    private String fotoUsuario;
    private String token;
}
