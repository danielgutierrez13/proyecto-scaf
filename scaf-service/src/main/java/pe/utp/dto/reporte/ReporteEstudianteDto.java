package pe.utp.dto.reporte;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ReporteEstudianteDto {
    private Long   codigoEstudiante;
    private String nombre;
    private String codigoUniversitario;
    private long   totalAsistencias;
    private int    totalSesiones;
    private int    porcentaje;
}
