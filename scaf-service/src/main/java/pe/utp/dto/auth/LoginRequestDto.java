package pe.utp.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDto {
    private String codigoUniversitario;
    private String password;
}
