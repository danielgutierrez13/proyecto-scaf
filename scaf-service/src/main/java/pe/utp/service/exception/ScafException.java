package pe.utp.service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ScafException extends RuntimeException {

    private final HttpStatus httpStatus;
    private final String codigo;

    public ScafException(HttpStatus httpStatus, String codigo, String mensaje) {
        super(mensaje);
        this.httpStatus = httpStatus;
        this.codigo = codigo;
    }

    public static ScafException of(CodigoError codigoError) {
        return new ScafException(
                codigoError.getHttpStatus(),
                codigoError.getCodigo(),
                codigoError.getMensaje()
        );
    }

    public static ScafException of(CodigoError codigoError, String mensajePersonalizado) {
        return new ScafException(
                codigoError.getHttpStatus(),
                codigoError.getCodigo(),
                mensajePersonalizado
        );
    }
}