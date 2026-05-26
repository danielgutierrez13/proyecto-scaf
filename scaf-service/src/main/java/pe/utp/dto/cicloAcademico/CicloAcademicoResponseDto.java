package pe.utp.dto.cicloAcademico;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonPropertyOrder({
        "codigoCicloAcademico",
        "anio",
        "semestre",
        "descripcion"
})
public class CicloAcademicoResponseDto {

    private Long codigoCicloAcademico;
    private int anio;
    private int semestre;
    private String descripcion;
}
