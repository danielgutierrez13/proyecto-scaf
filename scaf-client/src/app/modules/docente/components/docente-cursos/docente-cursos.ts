import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsignacionResponse } from '../../../../core/models/asignacion.model';
import { AuthService } from '../../../../core/services/auth.service';
import { DocenteService } from '../../service/docente.service';

@Component({
  selector: 'app-docente-cursos',
  imports: [RouterLink],
  templateUrl: './docente-cursos.html',
  styleUrl: './docente-cursos.scss',
})
export class DocenteCursosComponent implements OnInit {
  private readonly auth          = inject(AuthService);
  private readonly docenteService = inject(DocenteService);

  protected readonly cursos = signal<AsignacionResponse[]>([]);
  protected cargando = true;
  protected error: string | null = null;

  ngOnInit(): void {
    const codigoDocente = this.auth.usuario()?.codigoUsuario;
    if (!codigoDocente) return;

    this.docenteService.misCursos(codigoDocente).subscribe({
      next: (data) => { this.cursos.set(data); this.cargando = false; },
      error: (err) => {
        const status = err?.status ?? '';
        this.error = `Error ${status}: No se pudieron cargar los cursos. Verifica que exista un ciclo académico vigente.`;
        this.cargando = false;
      },
    });
  }
}
