package pe.utp.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonPropertyOrder({"codigo", "mensaje"})
public class ErrorResponseDto {

    private String codigo;
    private String mensaje;
}