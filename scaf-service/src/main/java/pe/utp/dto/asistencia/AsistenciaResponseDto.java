package pe.utp.dto.asistencia;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonPropertyOrder({
        "codigoAsistencia",
        "codigoUsuario",
        "nombreUsuario",
        "codigoAsignacion",
        "nombreCurso",
        "fecha",
        "horaIngreso",
        "estado",
        "codigoTipoAsistencia",
        "nombreTipoAsistencia"
})
public class AsistenciaResponseDto {

    private Long codigoAsistencia;
    private Long codigoUsuario;
    private String nombreUsuario;
    private Long codigoAsignacion;
    private String nombreCurso;
    private LocalDate fecha;
    private String horaIngreso;
    private Boolean estado;
    private Long codigoTipoAsistencia;
    private String nombreTipoAsistencia;
}
