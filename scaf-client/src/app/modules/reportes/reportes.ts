import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

export interface ReporteEstudiante {
  codigoEstudiante: number;
  nombre: string;
  codigoUniversitario: string;
  totalAsistencias: number;
  totalSesiones: number;
  porcentaje: number;
}

export interface ReporteCurso {
  codigoAsignacion: number;
  nombreCurso: string;
  nombreDocente: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  aula: string;
  ciclo: string;
  estudiantes: ReporteEstudiante[];
}

@Component({
  selector: 'app-reportes',
  imports: [FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
})
export class ReportesComponent implements OnInit {
  private readonly http = inject(HttpClient);

  protected readonly cursos    = signal<ReporteCurso[]>([]);
  protected readonly cargando  = signal(true);
  protected readonly error     = signal<string | null>(null);
  protected readonly filtro    = signal('');
  protected readonly expandido = signal<number | null>(null);

  protected readonly cursosFiltrados = computed(() => {
    const f = this.filtro().toLowerCase();
    return this.cursos().filter(c =>
      !f ||
      c.nombreCurso.toLowerCase().includes(f) ||
      c.nombreDocente.toLowerCase().includes(f) ||
      c.dia.toLowerCase().includes(f)
    );
  });

  ngOnInit(): void {
    this.http.get<ReporteCurso[]>(`${environment.apiBaseUrl}/api/reportes/asistencias`).subscribe({
      next: (data) => { this.cursos.set(data); this.cargando.set(false); },
      error: () => { this.error.set('No se pudieron cargar los reportes.'); this.cargando.set(false); },
    });
  }

  protected toggle(codigoAsignacion: number): void {
    this.expandido.update(v => v === codigoAsignacion ? null : codigoAsignacion);
  }

  protected promedioAsistencia(curso: ReporteCurso): number {
    if (!curso.estudiantes.length) return 0;
    const total = curso.estudiantes.reduce((s, e) => s + e.porcentaje, 0);
    return Math.round(total / curso.estudiantes.length);
  }

  protected estudiantesEnRiesgo(curso: ReporteCurso): number {
    return curso.estudiantes.filter(e => e.porcentaje < 70).length;
  }
}
