package pe.utp.dto.rol;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonPropertyOrder({
        "codigoRol",
        "nombreRol",
        "descripcion"
})
public class RolResponseDto {

    private Long codigoRol;
    private String nombreRol;
    private String descripcion;
}
