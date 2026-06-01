import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginateResponse } from '../../../core/models/paginate-response.model';
import { RolRequest, RolResponse } from '../../../core/models/rol.model';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private readonly apiUrl = 'http://localhost:9091/api/roles';

  constructor(private readonly http: HttpClient) {}

  listar(page: number, size: number): Observable<PaginateResponse<RolResponse>> {
    return this.http.get<PaginateResponse<RolResponse>>(this.apiUrl, {
      params: {
        page,
        size,
      },
    });
  }

  buscarPorId(id: number): Observable<RolResponse> {
    return this.http.get<RolResponse>(`${this.apiUrl}/${id}`);
  }

  crear(rol: RolRequest): Observable<RolResponse> {
    return this.http.post<RolResponse>(this.apiUrl, rol);
  }

  actualizar(id: number, rol: RolRequest): Observable<RolResponse> {
    return this.http.put<RolResponse>(`${this.apiUrl}/${id}`, rol);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
