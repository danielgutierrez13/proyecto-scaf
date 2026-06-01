import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { CursoResponse } from '../../../../core/models/curso.model';
import { CursoService } from '../../service/curso.service';

@Component({
  selector: 'app-curso-list',
  imports: [RouterLink, MatButtonModule, MatPaginatorModule, MatTableModule],
  templateUrl: './curso-list.html',
  styleUrl: './curso-list.scss',
})
export class CursoListComponent implements OnInit {
  private readonly cursoService = inject(CursoService);
  protected readonly pageSize = 10;

  protected readonly cursos = signal<CursoResponse[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly totalItems = signal(0);
  protected readonly totalPaginas = signal(0);
  protected readonly paginaActual = signal(0);

  ngOnInit(): void {
    this.cargarCursos();
  }

  protected cargarCursos(page = this.paginaActual()): void {
    this.cargando.set(true);
    this.error.set(null);

    this.cursoService.listar(page, this.pageSize).subscribe({
      next: (response) => {
        this.cursos.set(response.lista ?? []);
        this.totalItems.set(response.totalItems ?? 0);
        this.totalPaginas.set(response.totalPaginas ?? 0);
        this.paginaActual.set(response.numeroPagina ?? page);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de cursos.');
        this.cargando.set(false);
      },
    });
  }

  protected cambiarPagina(delta: number): void {
    const siguientePagina = this.paginaActual() + delta;

    if (siguientePagina < 0 || siguientePagina >= this.totalPaginas()) {
      return;
    }

    this.cargarCursos(siguientePagina);
  }

  protected eliminarCurso(curso: CursoResponse): void {
    const confirmado = window.confirm(`Desea eliminar el curso "${curso.nombre}"?`);

    if (!confirmado) {
      return;
    }

    this.cursoService.eliminar(curso.codigoCurso).subscribe({
      next: () => this.cargarCursos(),
      error: () => this.error.set('No se pudo eliminar el curso seleccionado.'),
    });
  }
}
