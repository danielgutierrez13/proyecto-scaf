import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { InscripcionRequest, InscripcionResponse } from '../../../core/models/inscripcion.model';
import { PaginateResponse } from '../../../core/models/paginate-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InscripcionService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/inscripciones`;

  constructor(private readonly http: HttpClient) {}

  listar(page: number, size: number): Observable<PaginateResponse<InscripcionResponse>> {
    return this.http.get<PaginateResponse<InscripcionResponse>>(this.apiUrl, {
      params: { page, size },
    });
  }

  buscarPorId(id: number): Observable<InscripcionResponse> {
    return this.http.get<InscripcionResponse>(`${this.apiUrl}/${id}`);
  }

  crear(inscripcion: InscripcionRequest): Observable<InscripcionResponse> {
    return this.http.post<InscripcionResponse>(this.apiUrl, inscripcion);
  }

  actualizar(id: number, inscripcion: InscripcionRequest): Observable<InscripcionResponse> {
    return this.http.put<InscripcionResponse>(`${this.apiUrl}/${id}`, inscripcion);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
