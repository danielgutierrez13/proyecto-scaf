package pe.utp.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaginateResponseDto<T> {

    List<T> lista;
    Long totalItems;
    Integer totalPaginas;
    Integer numeroPagina;
}
