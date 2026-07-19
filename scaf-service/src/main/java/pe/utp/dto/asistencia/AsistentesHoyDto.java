package pe.utp.dto.asistencia;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AsistentesHoyDto {
    private Long   codigoEstudiante;
    private String nombreEstudiante;
    private String codigoUniversitario;
    private String horaIngreso;
}
