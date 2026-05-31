package pe.utp.dto.asignacion;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AsignacionRequestDto {

    private Long codigoDocente;
    private Long codigoCurso;
    private Long codigoHorario;
    private Long codigoCicloAcademico;
}
