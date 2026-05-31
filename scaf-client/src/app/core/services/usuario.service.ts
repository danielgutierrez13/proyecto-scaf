import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginateResponse } from '../models/paginate-response.model';
import { UsuarioResponse } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly apiUrl = 'http://localhost:9091/api/usuarios';

  constructor(private readonly http: HttpClient) {}

  listar(page: number, size: number): Observable<PaginateResponse<UsuarioResponse>> {
    return this.http.get<PaginateResponse<UsuarioResponse>>(this.apiUrl, {
      params: { page, size }
    });
  }
}
