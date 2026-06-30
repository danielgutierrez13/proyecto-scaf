package pe.utp.dto.asistencia;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReconocimientoRequestDto {
    private Long codigoAsignacion;
    private String imagenBase64;
}
