export interface CicloAcademicoRequest {
  anio: number;
  semestre: number;
  descripcion: string;
  vigente: boolean;
}

export interface CicloAcademicoResponse {
  codigoCicloAcademico: number;
  anio: number;
  semestre: number;
  descripcion: string;
  vigente: boolean;
}
