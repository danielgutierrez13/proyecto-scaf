package pe.utp.dto.horario;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HorarioRequestDto {

    private String dia;
    private String horaInicio;
    private String horaFin;
    private String aula;
}
