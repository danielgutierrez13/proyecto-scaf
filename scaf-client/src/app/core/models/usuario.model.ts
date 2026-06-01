export interface UsuarioRequest {
  nombres: string;
  apellidos: string;
  codigoUniversitario: string;
  correoInstitucional: string;
  password: string;
  telefono: string;
  codigoRol: number | null;
  fotoUsuario: string;
  codigoCarrera: number | null;
  estado: boolean;
}

export interface UsuarioResponse {
  codigoUsuario: number;
  nombres: string;
  apellidos: string;
  codigoUniversitario: string;
  correoInstitucional: string;
  telefono: string;
  fotoUsuario: string;
  estado: boolean;
  codigoRol: number;
  nombreRol: string;
  codigoCarrera: number;
  nombreCarrera: string;
}
