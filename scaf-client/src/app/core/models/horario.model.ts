export interface HorarioRequest {
  dia: string;
  horaInicio: string;
  horaFin: string;
  aula: string;
}

export interface HorarioResponse {
  codigoHorario: number;
  dia: string;
  horaInicio: string;
  horaFin: string;
  aula: string;
}
