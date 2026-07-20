import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CursoRequest, CursoResponse } from '../../../core/models/curso.model';
import { PaginateResponse } from '../../../core/models/paginate-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/cursos`;

  constructor(private readonly http: HttpClient) {}

  listar(page: number, size: number): Observable<PaginateResponse<CursoResponse>> {
    return this.http.get<PaginateResponse<CursoResponse>>(this.apiUrl, {
      params: {
        page,
        size
      }
    });
  }

  buscarPorId(id: number): Observable<CursoResponse> {
    return this.http.get<CursoResponse>(`${this.apiUrl}/${id}`);
  }

  crear(curso: CursoRequest): Observable<CursoResponse> {
    return this.http.post<CursoResponse>(this.apiUrl, curso);
  }

  actualizar(id: number, curso: CursoRequest): Observable<CursoResponse> {
    return this.http.put<CursoResponse>(`${this.apiUrl}/${id}`, curso);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
