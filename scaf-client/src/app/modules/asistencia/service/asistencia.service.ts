import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ReconocimientoResponse {
  estado: string;
  mensaje: string;
  codigoEstudiante?: string;
  nombreEstudiante?: string;
  horaRegistro?: string;
}

export interface AsistenteHoy {
  codigoEstudiante:   number;
  nombreEstudiante:   string;
  codigoUniversitario: string;
  horaIngreso:        string;
}

@Injectable({ providedIn: 'root' })
export class AsistenciaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/asistencias`;

  reconocer(codigoAsignacion: number, imagenBase64: string): Observable<ReconocimientoResponse> {
    return this.http.post<ReconocimientoResponse>(`${this.apiUrl}/reconocer`, {
      codigoAsignacion,
      imagenBase64,
    });
  }

  asistentesHoy(codigoAsignacion: number): Observable<AsistenteHoy[]> {
    return this.http.get<AsistenteHoy[]>(`${this.apiUrl}/asignacion/${codigoAsignacion}/hoy`);
  }
}
