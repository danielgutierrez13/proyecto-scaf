package pe.utp.dto.asistencia;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AsistenciaResumenDto {
    private Long   codigoAsignacion;
    private String nombreCurso;
    private String diaHorario;
    private String horaInicio;
    private String horaFin;
    private String aula;
    private long   totalAsistencias;
    private int    totalSesiones;    // 18 sesiones por ciclo (1 vez/semana)
    private int    porcentaje;       // (totalAsistencias / totalSesiones) * 100
}
