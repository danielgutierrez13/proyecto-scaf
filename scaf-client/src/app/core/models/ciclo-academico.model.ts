export interface CicloAcademicoRequest {
  anio: number;
  semestre: number;
  descripcion: string;
}

export interface CicloAcademicoResponse {
  codigoCicloAcademico: number;
  anio: number;
  semestre: number;
  descripcion: string;
}
