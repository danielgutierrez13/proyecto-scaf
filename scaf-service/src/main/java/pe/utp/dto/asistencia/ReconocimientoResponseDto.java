package pe.utp.dto.asistencia;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ReconocimientoResponseDto {
    private String estado;
    private String mensaje;
    private Long codigoEstudiante;
    private String nombreEstudiante;
    private String horaRegistro;
}
