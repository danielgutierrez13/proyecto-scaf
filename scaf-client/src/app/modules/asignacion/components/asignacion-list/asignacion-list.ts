import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { AsignacionResponse } from '../../../../core/models/asignacion.model';
import { AsignacionService } from '../../service/asignacion.service';

@Component({
  selector: 'app-asignacion-list',
  imports: [RouterLink, MatButtonModule, MatPaginatorModule, MatTableModule],
  templateUrl: './asignacion-list.html',
  styleUrl: './asignacion-list.scss',
})
export class AsignacionListComponent implements OnInit {
  private readonly asignacionService = inject(AsignacionService);
  protected readonly pageSize = 10;

  protected readonly asignaciones = signal<AsignacionResponse[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly totalItems = signal(0);
  protected readonly totalPaginas = signal(0);
  protected readonly paginaActual = signal(0);

  ngOnInit(): void {
    this.cargarAsignaciones();
  }

  protected cargarAsignaciones(page = this.paginaActual()): void {
    this.cargando.set(true);
    this.error.set(null);

    this.asignacionService.listar(page, this.pageSize).subscribe({
      next: (response) => {
        this.asignaciones.set(response.lista ?? []);
        this.totalItems.set(response.totalItems ?? 0);
        this.totalPaginas.set(response.totalPaginas ?? 0);
        this.paginaActual.set(response.numeroPagina ?? page);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de asignaciones.');
        this.cargando.set(false);
      },
    });
  }

  protected cambiarPagina(delta: number): void {
    const siguientePagina = this.paginaActual() + delta;

    if (siguientePagina < 0 || siguientePagina >= this.totalPaginas()) {
      return;
    }

    this.cargarAsignaciones(siguientePagina);
  }

  protected eliminarAsignacion(asignacion: AsignacionResponse): void {
    const confirmado = window.confirm(`Desea eliminar la asignacion de "${asignacion.nombreCurso}"?`);

    if (!confirmado) {
      return;
    }

    this.asignacionService.eliminar(asignacion.codigoAsignacion).subscribe({
      next: () => this.cargarAsignaciones(),
      error: () => this.error.set('No se pudo eliminar la asignacion seleccionada.'),
    });
  }
}
