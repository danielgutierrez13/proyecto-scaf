import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CursoRequest, CursoResponse } from '../models/curso.model';
import { PaginateResponse } from '../models/paginate-response.model';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private readonly apiUrl = 'http://localhost:9091/api/cursos';

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
