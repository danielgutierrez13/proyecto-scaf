import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CicloAcademicoRequest, CicloAcademicoResponse } from '../models/ciclo-academico.model';
import { PaginateResponse } from '../models/paginate-response.model';

@Injectable({
  providedIn: 'root'
})
export class CicloAcademicoService {
  private readonly apiUrl = 'http://localhost:9091/api/cicloAcademico';

  constructor(private readonly http: HttpClient) {}

  listar(page: number, size: number): Observable<PaginateResponse<CicloAcademicoResponse>> {
    return this.http.get<PaginateResponse<CicloAcademicoResponse>>(this.apiUrl, {
      params: { page, size }
    });
  }

  buscarPorId(id: number): Observable<CicloAcademicoResponse> {
    return this.http.get<CicloAcademicoResponse>(`${this.apiUrl}/${id}`);
  }

  crear(cicloAcademico: CicloAcademicoRequest): Observable<CicloAcademicoResponse> {
    return this.http.post<CicloAcademicoResponse>(this.apiUrl, cicloAcademico);
  }

  actualizar(id: number, cicloAcademico: CicloAcademicoRequest): Observable<CicloAcademicoResponse> {
    return this.http.put<CicloAcademicoResponse>(`${this.apiUrl}/${id}`, cicloAcademico);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
