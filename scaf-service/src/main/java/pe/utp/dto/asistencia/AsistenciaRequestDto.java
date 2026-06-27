package pe.utp.dto.asistencia;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AsistenciaRequestDto {

    private Long codigoUsuario;
    private Long codigoAsignacion;
    private LocalDate fecha;
    private String horaIngreso;
    private Boolean estado;
    private Long codigoTipoAsistencia;
}
