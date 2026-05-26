package pe.utp.dto.curso;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonPropertyOrder({
        "codigoCurso",
        "nombre",
        "creditos",
        "ciclo",
        "modalidad"
})
public class CursoResponseDto {

    private Long codigoCurso;
    private String nombre;
    private Integer creditos;
    private Integer ciclo;
    private String modalidad;
}
