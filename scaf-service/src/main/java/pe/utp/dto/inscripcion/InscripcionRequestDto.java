package pe.utp.dto.inscripcion;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InscripcionRequestDto {

    private Long codigoEstudiante;
    private Long codigoAsignacion;
}
