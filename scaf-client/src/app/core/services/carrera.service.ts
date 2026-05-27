import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CarreraRequest, CarreraResponse } from '../models/carrera.model';
import { PaginateResponse } from '../models/paginate-response.model';

interface SpringPageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarreraService {
  private readonly apiUrl = 'http://localhost:9091/api/carreras';

  constructor(private readonly http: HttpClient) {}

  listar(page: number, size: number): Observable<PaginateResponse<CarreraResponse>> {
    return this.http.get<SpringPageResponse<CarreraResponse>>(this.apiUrl, {
      params: {
        page,
        size
      }
    }).pipe(
      map((response) => ({
        lista: response.content,
        totalItems: response.totalElements,
        totalPaginas: response.totalPages,
        numeroPagina: response.number
      }))
    );
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
