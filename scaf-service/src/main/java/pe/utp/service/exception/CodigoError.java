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
    ROL_NO_ENCONTRADO("ROL-001", "Rol no encontrado", HttpStatus.UNPROCESSABLE_CONTENT),

    // Ciclo academico
    CICLO_ACADEMICO_NO_ENCONTRADO("CIC-001", "Ciclo academico no encontrado", HttpStatus.UNPROCESSABLE_CONTENT),

    // Curso
    CURSO_NO_ENCONTRADO("CUR-001", "Curso no encontrado", HttpStatus.UNPROCESSABLE_CONTENT),

    // Horario
    HORARIO_NO_ENCONTRADO("HOR-001", "Horario no encontrado", HttpStatus.UNPROCESSABLE_CONTENT),

    // Tipo asistencia
    TIPO_ASISTENCIA_NO_ENCONTRADO("TAS-001", "Tipo de asistencia no encontrado", HttpStatus.UNPROCESSABLE_CONTENT),

    // Asignacion
    ASIGNACION_NO_ENCONTRADA("ASI-001", "Asignacion no encontrada", HttpStatus.UNPROCESSABLE_CONTENT),
    ASIGNACION_DOCENTE_NO_ENCONTRADO("ASI-002", "El docente especificado no existe", HttpStatus.UNPROCESSABLE_CONTENT),
    ASIGNACION_CURSO_NO_ENCONTRADO("ASI-003", "El curso especificado no existe", HttpStatus.UNPROCESSABLE_CONTENT),
    ASIGNACION_HORARIO_NO_ENCONTRADO("ASI-004", "El horario especificado no existe", HttpStatus.UNPROCESSABLE_CONTENT),
    ASIGNACION_CICLO_ACADEMICO_NO_ENCONTRADO("ASI-005", "El ciclo academico especificado no existe", HttpStatus.UNPROCESSABLE_CONTENT),

    // Inscripcion
    INSCRIPCION_NO_ENCONTRADA("INS-001", "Inscripcion no encontrada", HttpStatus.UNPROCESSABLE_CONTENT),
    INSCRIPCION_ESTUDIANTE_NO_ENCONTRADO("INS-002", "El estudiante especificado no existe", HttpStatus.UNPROCESSABLE_CONTENT),
    INSCRIPCION_ASIGNACION_NO_ENCONTRADA("INS-003", "La asignacion especificada no existe", HttpStatus.UNPROCESSABLE_CONTENT),

    // Asistencia
    ASISTENCIA_NO_ENCONTRADA("AST-001", "Asistencia no encontrada", HttpStatus.UNPROCESSABLE_CONTENT),
    ASISTENCIA_USUARIO_NO_ENCONTRADO("AST-002", "El usuario especificado no existe", HttpStatus.UNPROCESSABLE_CONTENT),
    ASISTENCIA_ASIGNACION_NO_ENCONTRADA("AST-003", "La asignacion especificada no existe", HttpStatus.UNPROCESSABLE_CONTENT),
    ASISTENCIA_TIPO_ASISTENCIA_NO_ENCONTRADO("AST-004", "El tipo de asistencia especificado no existe", HttpStatus.UNPROCESSABLE_CONTENT);

    private final String codigo;
    private final String mensaje;
    private final HttpStatus httpStatus;

    CodigoError(String codigo, String mensaje, HttpStatus httpStatus) {
        this.codigo = codigo;
        this.mensaje = mensaje;
        this.httpStatus = httpStatus;
    }
}
