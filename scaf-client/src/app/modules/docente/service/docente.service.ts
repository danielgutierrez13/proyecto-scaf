import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AsignacionResponse } from '../../../core/models/asignacion.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DocenteService {
  private readonly http         = inject(HttpClient);
  private readonly apiUrl       = `${environment.apiBaseUrl}/api/docente`;
  private readonly asignaciones = `${environment.apiBaseUrl}/api/asignaciones`;

  misCursos(codigoDocente: number): Observable<AsignacionResponse[]> {
    return this.http.get<AsignacionResponse[]>(`${this.apiUrl}/${codigoDocente}/cursos`);
  }

  getCurso(codigoAsignacion: number): Observable<AsignacionResponse> {
    return this.http.get<AsignacionResponse>(`${this.asignaciones}/${codigoAsignacion}`);
  }
}
