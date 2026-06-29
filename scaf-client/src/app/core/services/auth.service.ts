import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { SessionUser } from '../models/session-user.model';

const SESSION_KEY = 'scaf_user';
const TOKEN_KEY   = 'scaf_token';

interface LoginResponse extends SessionUser {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http       = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiUrl     = 'http://localhost:9091/api/auth';

  private readonly _usuario = signal<SessionUser | null>(this.cargarSesion());

  readonly usuario = this._usuario.asReadonly();

  login(codigoUniversitario: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, { codigoUniversitario, password })
      .pipe(
        tap((res) => {
          if (isPlatformBrowser(this.platformId)) {
            const { token, ...user } = res;
            localStorage.setItem(SESSION_KEY, JSON.stringify(user));
            localStorage.setItem(TOKEN_KEY, token);
          }
          this._usuario.set(res);
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
    this._usuario.set(null);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  estaAutenticado(): boolean {
    return this._usuario() !== null;
  }

  esRol(rol: string): boolean {
    return this._usuario()?.nombreRol?.toLowerCase() === rol.toLowerCase();
  }

  private cargarSesion(): SessionUser | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
