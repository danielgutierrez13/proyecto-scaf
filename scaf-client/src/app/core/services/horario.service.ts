import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HorarioResponse } from '../models/horario.model';
import { PaginateResponse } from '../models/paginate-response.model';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private readonly apiUrl = 'http://localhost:9091/api/horarios';

  constructor(private readonly http: HttpClient) {}

  listar(page: number, size: number): Observable<PaginateResponse<HorarioResponse>> {
    return this.http.get<PaginateResponse<HorarioResponse>>(this.apiUrl, {
      params: { page, size }
    });
  }
}
