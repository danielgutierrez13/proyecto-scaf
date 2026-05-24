package pe.utp.dto.usuario;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonPropertyOrder({
        "codigoUsuario",
        "nombres",
        "apellidos",
        "codigoUniversitario",
        "correoInstitucional",
        "telefono",
        "fotoUsuario",
        "estado",
        "codigoRol",
        "nombreRol",
        "codigoCarrera",
        "nombreCarrera"
})
public class UsuarioResponseDto {

    private Long codigoUsuario;
    private String nombres;
    private String apellidos;
    private String codigoUniversitario;
    private String correoInstitucional;
    private String telefono;
    private String fotoUsuario;
    private Boolean estado;
    private Long codigoRol;
    private String nombreRol;
    private Long codigoCarrera;
    private String nombreCarrera;
}