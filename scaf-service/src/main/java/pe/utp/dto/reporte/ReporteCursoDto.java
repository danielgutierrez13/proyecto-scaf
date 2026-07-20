package pe.utp.dto.reporte;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ReporteCursoDto {
    private Long   codigoAsignacion;
    private String nombreCurso;
    private String nombreDocente;
    private String dia;
    private String horaInicio;
    private String horaFin;
    private String aula;
    private String ciclo;
    private List<ReporteEstudianteDto> estudiantes;
}
