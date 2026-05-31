export interface InscripcionRequest {
  codigoEstudiante: number;
  codigoAsignacion: number;
}

export interface InscripcionResponse {
  codigoInscripcion: number;
  codigoEstudiante: number;
  nombreEstudiante: string;
  codigoAsignacion: number;
  nombreCurso: string;
}
