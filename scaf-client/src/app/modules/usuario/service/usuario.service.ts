import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginateResponse } from '../../../core/models/paginate-response.model';
import { UsuarioRequest, UsuarioResponse } from '../../../core/models/usuario.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/usuarios`;

  constructor(private readonly http: HttpClient) {}

  listar(page: number, size: number): Observable<PaginateResponse<UsuarioResponse>> {
    return this.http.get<PaginateResponse<UsuarioResponse>>(this.apiUrl, {
      params: {
        page,
        size,
      },
    });
  }

  listarPorRol(page: number, size: number, nombreRol: string): Observable<PaginateResponse<UsuarioResponse>> {
    return this.http.get<PaginateResponse<UsuarioResponse>>(this.apiUrl, {
      params: {
        page,
        size,
        nombreRol,
      },
    });
  }

  buscarPorId(id: number): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/${id}`);
  }

  crear(usuario: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(this.apiUrl, usuario);
  }

  actualizar(id: number, usuario: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${this.apiUrl}/${id}`, usuario);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  subirRostros(id: number, formData: FormData): Observable<{ rostrosGuardados: number }> {
    return this.http.post<{ rostrosGuardados: number }>(`${this.apiUrl}/${id}/rostros`, formData);
  }
}
