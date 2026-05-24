package pe.utp.service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum CodigoError {

    // Usuario
    USUARIO_NO_ENCONTRADO("USR-001", "Usuario no encontrado", HttpStatus.UNPROCESSABLE_CONTENT),
    USUARIO_ROL_NO_ENCONTRADO("USR-002", "El rol especificado no existe", HttpStatus.UNPROCESSABLE_CONTENT),
    USUARIO_CARRERA_NO_ENCONTRADA("USR-003", "La carrera especificada no existe", HttpStatus.UNPROCESSABLE_CONTENT),

    // Carrera
    CARRERA_NO_ENCONTRADA("CAR-001", "Carrera no encontrada", HttpStatus.UNPROCESSABLE_CONTENT),

    // Rol
    ROL_NO_ENCONTRADO("ROL-001", "Rol no encontrado", HttpStatus.UNPROCESSABLE_CONTENT);

    private final String codigo;
    private final String mensaje;
    private final HttpStatus httpStatus;

    CodigoError(String codigo, String mensaje, HttpStatus httpStatus) {
        this.codigo = codigo;
        this.mensaje = mensaje;
        this.httpStatus = httpStatus;
    }
}