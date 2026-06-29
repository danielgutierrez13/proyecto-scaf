import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AsignacionResponse } from '../../../core/models/asignacion.model';

@Injectable({ providedIn: 'root' })
export class DocenteService {
  private readonly http         = inject(HttpClient);
  private readonly apiUrl       = 'http://localhost:9091/api/docente';
  private readonly asignaciones = 'http://localhost:9091/api/asignaciones';

  misCursos(codigoDocente: number): Observable<AsignacionResponse[]> {
    return this.http.get<AsignacionResponse[]>(`${this.apiUrl}/${codigoDocente}/cursos`);
  }

  getCurso(codigoAsignacion: number): Observable<AsignacionResponse> {
    return this.http.get<AsignacionResponse>(`${this.asignaciones}/${codigoAsignacion}`);
  }
}
