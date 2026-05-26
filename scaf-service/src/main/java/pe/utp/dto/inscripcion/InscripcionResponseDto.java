package pe.utp.dto.inscripcion;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonPropertyOrder({
        "codigoInscripcion",
        "codigoEstudiante",
        "nombreEstudiante",
        "codigoAsignacion",
        "nombreCurso"
})
public class InscripcionResponseDto {

    private Long codigoInscripcion;
    private Long codigoEstudiante;
    private String nombreEstudiante;
    private Long codigoAsignacion;
    private String nombreCurso;
}
