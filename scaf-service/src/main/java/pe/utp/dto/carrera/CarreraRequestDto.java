package pe.utp.dto.carrera;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CarreraRequestDto {

    private String nombreCarrera;
    private String descripcion;
}
