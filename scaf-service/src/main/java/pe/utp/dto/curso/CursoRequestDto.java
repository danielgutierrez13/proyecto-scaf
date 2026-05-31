package pe.utp.dto.curso;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CursoRequestDto {

    private String nombre;
    private Integer creditos;
    private Integer ciclo;
    private String modalidad;
}
