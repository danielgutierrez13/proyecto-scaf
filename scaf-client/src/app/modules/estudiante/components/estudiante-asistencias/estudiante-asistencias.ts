import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { AsistenciaResumen, EstudianteService } from '../../service/estudiante.service';

@Component({
  selector: 'app-estudiante-asistencias',
  templateUrl: './estudiante-asistencias.html',
  styleUrl: './estudiante-asistencias.scss',
})
export class EstudianteAsistenciasComponent implements OnInit {
  private readonly auth             = inject(AuthService);
  private readonly estudianteService = inject(EstudianteService);

  protected readonly asistencias = signal<AsistenciaResumen[]>([]);
  protected readonly cargando    = signal(true);
  protected readonly error       = signal<string | null>(null);

  ngOnInit(): void {
    const codigoEstudiante = this.auth.usuario()?.codigoUsuario;
    if (!codigoEstudiante) return;

    this.estudianteService.misAsistencias(codigoEstudiante).subscribe({
      next: (data) => { this.asistencias.set(data); this.cargando.set(false); },
      error: (err) => {
        this.error.set(`Error ${err?.status ?? ''}: No se pudieron cargar las asistencias.`);
        this.cargando.set(false);
      },
    });
  }
}
