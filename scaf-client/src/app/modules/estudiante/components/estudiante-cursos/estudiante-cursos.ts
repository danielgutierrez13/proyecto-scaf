import { KeyValuePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { InscripcionResponse } from '../../../../core/models/inscripcion.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AsistenciaResumen, EstudianteService } from '../../service/estudiante.service';

@Component({
  selector: 'app-estudiante-cursos',
  imports: [KeyValuePipe],
  templateUrl: './estudiante-cursos.html',
  styleUrl: './estudiante-cursos.scss',
})
export class EstudianteCursosComponent implements OnInit {
  private readonly auth              = inject(AuthService);
  private readonly estudianteService = inject(EstudianteService);

  protected readonly cursos      = signal<InscripcionResponse[]>([]);
  protected readonly asistencias = signal<AsistenciaResumen[]>([]);
  protected readonly cargando    = signal(true);
  protected readonly error       = signal<string | null>(null);

  // codigoAsignacion de la tarjeta actualmente expandida
  protected readonly expandida = signal<number | null>(null);

  ngOnInit(): void {
    const codigo = this.auth.usuario()?.codigoUsuario;
    if (!codigo) return;

    this.estudianteService.misCursos(codigo).subscribe({
      next: (data) => { this.cursos.set(data); this.cargando.set(false); },
      error: () => { this.error.set('No se pudieron cargar los cursos.'); this.cargando.set(false); },
    });

    this.estudianteService.misAsistencias(codigo).subscribe({
      next: (data) => this.asistencias.set(data),
    });
  }

  protected toggleAsistencias(codigoAsignacion: number): void {
    this.expandida.update(v => v === codigoAsignacion ? null : codigoAsignacion);
  }

  protected asistenciasDelCurso(codigoAsignacion: number): number {
    return this.asistencias().find(a => a.codigoAsignacion === codigoAsignacion)?.totalAsistencias ?? 0;
  }

  protected get cursosPorCiclo(): Map<string, InscripcionResponse[]> {
    const mapa = new Map<string, InscripcionResponse[]>();
    for (const c of this.cursos()) {
      const ciclo = c.descripcionCiclo ?? 'Sin ciclo';
      if (!mapa.has(ciclo)) mapa.set(ciclo, []);
      mapa.get(ciclo)!.push(c);
    }
    return mapa;
  }
}
