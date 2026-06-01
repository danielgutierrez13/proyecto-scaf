import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AsignacionRequest, AsignacionResponse } from '../../../core/models/asignacion.model';
import { PaginateResponse } from '../../../core/models/paginate-response.model';

@Injectable({
  providedIn: 'root'
})
export class AsignacionService {
  private readonly apiUrl = 'http://localhost:9091/api/asignaciones';

  constructor(private readonly http: HttpClient) {}

  listar(page: number, size: number): Observable<PaginateResponse<AsignacionResponse>> {
    return this.http.get<PaginateResponse<AsignacionResponse>>(this.apiUrl, {
      params: { page, size }
    });
  }

  buscarPorId(id: number): Observable<AsignacionResponse> {
    return this.http.get<AsignacionResponse>(`${this.apiUrl}/${id}`);
  }

  crear(asignacion: AsignacionRequest): Observable<AsignacionResponse> {
    return this.http.post<AsignacionResponse>(this.apiUrl, asignacion);
  }

  actualizar(id: number, asignacion: AsignacionRequest): Observable<AsignacionResponse> {
    return this.http.put<AsignacionResponse>(`${this.apiUrl}/${id}`, asignacion);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
