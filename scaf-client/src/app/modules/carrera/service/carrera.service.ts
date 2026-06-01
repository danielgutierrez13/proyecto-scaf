import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CarreraRequest, CarreraResponse } from '../../../core/models/carrera.model';
import { PaginateResponse } from '../../../core/models/paginate-response.model';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {
  private readonly apiUrl = 'http://localhost:9091/api/carreras';

  constructor(private readonly http: HttpClient) {}

  listar(page: number, size: number): Observable<PaginateResponse<CarreraResponse>> {
    return this.http.get<PaginateResponse<CarreraResponse>>(this.apiUrl, {
      params: {
        page,
        size
      }
    });
  }

  buscarPorId(id: number): Observable<CarreraResponse> {
    return this.http.get<CarreraResponse>(`${this.apiUrl}/${id}`);
  }

  crear(carrera: CarreraRequest): Observable<CarreraResponse> {
    return this.http.post<CarreraResponse>(this.apiUrl, carrera);
  }

  actualizar(id: number, carrera: CarreraRequest): Observable<CarreraResponse> {
    return this.http.put<CarreraResponse>(`${this.apiUrl}/${id}`, carrera);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
