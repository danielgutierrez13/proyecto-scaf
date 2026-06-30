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
        "nombreCurso",
        "creditosCurso",
        "nombreDocente",
        "dia",
        "horaInicio",
        "horaFin",
        "aula",
        "descripcionCiclo"
})
public class InscripcionResponseDto {

    private Long codigoInscripcion;
    private Long codigoEstudiante;
    private String nombreEstudiante;
    private Long codigoAsignacion;
    private String nombreCurso;
    private Integer creditosCurso;
    private String nombreDocente;
    private String dia;
    private String horaInicio;
    private String horaFin;
    private String aula;
    private String descripcionCiclo;
}
