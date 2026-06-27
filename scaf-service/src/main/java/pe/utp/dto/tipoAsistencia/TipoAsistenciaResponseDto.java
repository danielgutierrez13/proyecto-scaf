package pe.utp.dto.tipoAsistencia;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonPropertyOrder({
        "codigoTipoAsistencia",
        "nombre",
        "descripcion"
})
public class TipoAsistenciaResponseDto {

    private Long codigoTipoAsistencia;
    private String nombre;
    private String descripcion;
}
