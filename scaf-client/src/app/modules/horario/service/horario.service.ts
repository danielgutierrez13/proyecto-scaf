import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HorarioRequest, HorarioResponse } from '../../../core/models/horario.model';
import { PaginateResponse } from '../../../core/models/paginate-response.model';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private readonly apiUrl = 'http://localhost:9091/api/horarios';

  constructor(private readonly http: HttpClient) {}

  listar(page: number, size: number): Observable<PaginateResponse<HorarioResponse>> {
    return this.http.get<PaginateResponse<HorarioResponse>>(this.apiUrl, {
      params: { page, size }
    });
  }

  buscarPorId(id: number): Observable<HorarioResponse> {
    return this.http.get<HorarioResponse>(`${this.apiUrl}/${id}`);
  }

  crear(horario: HorarioRequest): Observable<HorarioResponse> {
    return this.http.post<HorarioResponse>(this.apiUrl, horario);
  }

  actualizar(id: number, horario: HorarioRequest): Observable<HorarioResponse> {
    return this.http.put<HorarioResponse>(`${this.apiUrl}/${id}`, horario);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
