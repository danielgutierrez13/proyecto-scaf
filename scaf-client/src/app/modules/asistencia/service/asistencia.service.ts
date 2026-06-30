import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface ReconocimientoResponse {
  estado: string;
  mensaje: string;
  codigoEstudiante?: string;
  nombreEstudiante?: string;
  horaRegistro?: string;
}

@Injectable({ providedIn: 'root' })
export class AsistenciaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:9091/api/asistencias';

  reconocer(codigoAsignacion: number, imagenBase64: string): Observable<ReconocimientoResponse> {
    return this.http.post<ReconocimientoResponse>(`${this.apiUrl}/reconocer`, {
      codigoAsignacion,
      imagenBase64,
    });
  }
}
