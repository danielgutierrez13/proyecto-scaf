export interface AsignacionRequest {
  codigoDocente: number;
  codigoCurso: number;
  codigoHorario: number;
  codigoCicloAcademico: number;
}

export interface AsignacionResponse {
  codigoAsignacion: number;
  codigoDocente: number;
  nombreDocente: string;
  codigoCurso: number;
  nombreCurso: string;
  codigoHorario: number;
  diaHorario: string;
  codigoCicloAcademico: number;
  descripcionCicloAcademico: string;
}
