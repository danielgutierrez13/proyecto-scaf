package pe.utp.dto.tipoAsistencia;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TipoAsistenciaRequestDto {

    private String nombre;
    private String descripcion;
}
