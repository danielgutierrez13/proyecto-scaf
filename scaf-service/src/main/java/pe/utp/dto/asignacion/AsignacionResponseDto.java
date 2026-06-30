package pe.utp.dto.asignacion;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonPropertyOrder({
        "codigoAsignacion",
        "codigoDocente",
        "nombreDocente",
        "codigoCurso",
        "nombreCurso",
        "creditosCurso",
        "codigoHorario",
        "diaHorario",
        "horaInicio",
        "horaFin",
        "aula",
        "codigoCicloAcademico",
        "descripcionCicloAcademico"
})
public class AsignacionResponseDto {

    private Long codigoAsignacion;
    private Long codigoDocente;
    private String nombreDocente;
    private Long codigoCurso;
    private String nombreCurso;
    private Integer creditosCurso;
    private Long codigoHorario;
    private String diaHorario;
    private String horaInicio;
    private String horaFin;
    private String aula;
    private Long codigoCicloAcademico;
    private String descripcionCicloAcademico;
}
