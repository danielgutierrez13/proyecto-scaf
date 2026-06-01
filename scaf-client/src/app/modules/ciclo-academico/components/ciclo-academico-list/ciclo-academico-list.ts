import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { CicloAcademicoResponse } from '../../../../core/models/ciclo-academico.model';
import { CicloAcademicoService } from '../../service/ciclo-academico.service';

@Component({
  selector: 'app-ciclo-academico-list',
  imports: [RouterLink, MatButtonModule, MatPaginatorModule, MatTableModule],
  templateUrl: './ciclo-academico-list.html',
  styleUrl: './ciclo-academico-list.scss',
})
export class CicloAcademicoListComponent implements OnInit {
  private readonly cicloAcademicoService = inject(CicloAcademicoService);
  protected readonly pageSize = 10;

  protected readonly ciclos = signal<CicloAcademicoResponse[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly totalItems = signal(0);
  protected readonly totalPaginas = signal(0);
  protected readonly paginaActual = signal(0);

  ngOnInit(): void {
    this.cargarCiclos();
  }

  protected cargarCiclos(page = this.paginaActual()): void {
    this.cargando.set(true);
    this.error.set(null);

    this.cicloAcademicoService.listar(page, this.pageSize).subscribe({
      next: (response) => {
        this.ciclos.set(response.lista ?? []);
        this.totalItems.set(response.totalItems ?? 0);
        this.totalPaginas.set(response.totalPaginas ?? 0);
        this.paginaActual.set(response.numeroPagina ?? page);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de ciclos academicos.');
        this.cargando.set(false);
      },
    });
  }

  protected cambiarPagina(delta: number): void {
    const siguientePagina = this.paginaActual() + delta;

    if (siguientePagina < 0 || siguientePagina >= this.totalPaginas()) {
      return;
    }

    this.cargarCiclos(siguientePagina);
  }

  protected eliminarCiclo(ciclo: CicloAcademicoResponse): void {
    const confirmado = window.confirm(`Desea eliminar el ciclo "${ciclo.descripcion}"?`);

    if (!confirmado) {
      return;
    }

    this.cicloAcademicoService.eliminar(ciclo.codigoCicloAcademico).subscribe({
      next: () => this.cargarCiclos(),
      error: () => this.error.set('No se pudo eliminar el ciclo academico seleccionado.'),
    });
  }
}
