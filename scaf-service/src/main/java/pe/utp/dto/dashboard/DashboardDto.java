package pe.utp.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DashboardDto {
    private long totalEstudiantes;
    private long totalDocentes;
    private long totalCursos;
    private long asignacionesVigentes;
    private String cicloVigente;
}
