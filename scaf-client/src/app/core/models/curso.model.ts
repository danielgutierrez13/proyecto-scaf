export interface CursoRequest {
  nombre: string;
  creditos: number;
  ciclo: number;
  modalidad: string;
}

export interface CursoResponse {
  codigoCurso: number;
  nombre: string;
  creditos: number;
  ciclo: number;
  modalidad: string;
}
