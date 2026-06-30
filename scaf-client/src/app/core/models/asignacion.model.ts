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
  creditosCurso: number;
  codigoHorario: number;
  diaHorario: string;
  horaInicio: string;
  horaFin: string;
  aula: string;
  codigoCicloAcademico: number;
  descripcionCicloAcademico: string;
}
