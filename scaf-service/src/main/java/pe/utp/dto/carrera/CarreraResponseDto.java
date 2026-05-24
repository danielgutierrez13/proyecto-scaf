package pe.utp.dto.carrera;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonPropertyOrder({
        "codigoCarrera",
        "nombreCarrera",
        "descripcion"
})
public class CarreraResponseDto {

    private Long codigoCarrera;
    private String nombreCarrera;
    private String descripcion;
}
