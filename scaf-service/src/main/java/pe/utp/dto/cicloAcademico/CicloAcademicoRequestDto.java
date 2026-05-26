package pe.utp.dto.cicloAcademico;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CicloAcademicoRequestDto {

    private int anio;
    private int semestre;
    private String descripcion;
}
