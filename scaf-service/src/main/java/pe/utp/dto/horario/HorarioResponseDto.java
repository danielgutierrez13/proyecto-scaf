package pe.utp.dto.horario;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonPropertyOrder({
        "codigoHorario",
        "dia",
        "horaInicio",
        "horaFin",
        "aula"
})
public class HorarioResponseDto {

    private Long codigoHorario;
    private String dia;
    private String horaInicio;
    private String horaFin;
    private String aula;
}
