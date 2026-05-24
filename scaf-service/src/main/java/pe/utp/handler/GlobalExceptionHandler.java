package pe.utp.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import pe.utp.dto.ErrorResponseDto;
import pe.utp.service.exception.ScafException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ScafException.class)
    public ResponseEntity<ErrorResponseDto> handleScafException(ScafException ex) {
        ErrorResponseDto error = new ErrorResponseDto(ex.getCodigo(), ex.getMessage());
        return ResponseEntity.status(ex.getHttpStatus()).body(error);
    }
}