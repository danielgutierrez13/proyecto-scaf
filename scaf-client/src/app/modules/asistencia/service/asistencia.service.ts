import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { AsistenciaRequest, AsistenciaResponse } from '../../../core/models/asistencia.model';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  private modoDemo = false;

  constructor() {}

  tomarAsistencia(_request: AsistenciaRequest): Observable<AsistenciaResponse> {
    this.modoDemo = true;

    // Mock simple: resultado segun numero aleatorio (1-2)
    const aleatorio = Math.floor(Math.random() * 2) + 1;
    let mockResponse: AsistenciaResponse;

    if (aleatorio === 1) {
      mockResponse = {
        estado: 'RECONOCIDO',
        mensaje: `[DEMO] Rostro reconocido por sorteo (${aleatorio}/2).`,
        nombreEstudiante: 'Estudiante Demo',
        horaRegistro: new Date().toLocaleTimeString('es-PE'),
      };
    } else {
      mockResponse = {
        estado: 'NO_RECONOCIDO',
        mensaje: `[DEMO] Rostro no reconocido por sorteo (${aleatorio}/2).`,
      };
    }

    return of(mockResponse).pipe(delay(1200));
  }

  esModoDemo(): boolean {
    return this.modoDemo;
  }
}
