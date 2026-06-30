import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AsignacionResponse } from '../../../core/models/asignacion.model';
import { InscripcionResponse } from '../../../core/models/inscripcion.model';

export interface AsistenciaResumen {
  codigoAsignacion: number;
  nombreCurso:      string;
  diaHorario:       string;
  horaInicio:       string;
  horaFin:          string;
  aula:             string;
  totalAsistencias: number;
}

@Injectable({ providedIn: 'root' })
export class EstudianteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:9091/api/estudiante';

  misCursos(codigoEstudiante: number): Observable<InscripcionResponse[]> {
    return this.http.get<InscripcionResponse[]>(`${this.apiUrl}/${codigoEstudiante}/cursos`);
  }

  miHorario(codigoEstudiante: number): Observable<InscripcionResponse[]> {
    return this.http.get<InscripcionResponse[]>(`${this.apiUrl}/${codigoEstudiante}/horario`);
  }

  disponibles(codigoEstudiante: number): Observable<AsignacionResponse[]> {
    return this.http.get<AsignacionResponse[]>(`${this.apiUrl}/${codigoEstudiante}/disponibles`);
  }

  misAsistencias(codigoEstudiante: number): Observable<AsistenciaResumen[]> {
    return this.http.get<AsistenciaResumen[]>(`${this.apiUrl}/${codigoEstudiante}/asistencias`);
  }

  tieneRostro(codigoUniversitario: string): Observable<{ tieneRostro: boolean }> {
    return this.http.get<{ tieneRostro: boolean }>(`${this.apiUrl}/${codigoUniversitario}/tiene-rostro`);
  }
}
