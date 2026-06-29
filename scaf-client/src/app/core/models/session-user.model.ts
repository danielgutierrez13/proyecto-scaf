export interface SessionUser {
  codigoUsuario: number;
  nombres: string;
  apellidos: string;
  correoInstitucional: string;
  codigoUniversitario: string;
  nombreRol: string;
  fotoUsuario: string | null;
}

export type Rol = 'Administrativo' | 'Estudiante' | 'Docente';
