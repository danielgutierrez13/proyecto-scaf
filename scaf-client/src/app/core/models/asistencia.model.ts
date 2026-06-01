export interface AsistenciaRequest {
  codigoAsignacion: number;
  imagenBase64: string;
}

export type EstadoAsistencia = 'RECONOCIDO' | 'NO_RECONOCIDO' | 'ERROR';

export interface AsistenciaResponse {
  estado: EstadoAsistencia;
  mensaje: string;
  nombreEstudiante?: string;
  codigoEstudiante?: number;
  horaRegistro?: string;
}

export interface RegistroRostroRequest {
  imagenBase64: string;
}

export interface RegistroRostroResponse {
  exito: boolean;
  mensaje: string;
}
