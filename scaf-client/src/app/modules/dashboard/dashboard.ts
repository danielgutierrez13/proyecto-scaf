import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface DashboardStats {
  totalEstudiantes:    number;
  totalDocentes:       number;
  totalCursos:         number;
  asignacionesVigentes: number;
  cicloVigente:        string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);

  protected readonly stats   = signal<DashboardStats | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error    = signal<string | null>(null);

  ngOnInit(): void {
    this.http.get<DashboardStats>(`${environment.apiBaseUrl}/api/dashboard`).subscribe({
      next:  (data) => { this.stats.set(data); this.cargando.set(false); },
      error: ()     => { this.error.set('No se pudieron cargar las estadísticas.'); this.cargando.set(false); },
    });
  }
}
