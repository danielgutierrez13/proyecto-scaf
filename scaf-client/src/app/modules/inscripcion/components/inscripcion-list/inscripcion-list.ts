import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { InscripcionResponse } from '../../../../core/models/inscripcion.model';
import { InscripcionService } from '../../service/inscripcion.service';

@Component({
  selector: 'app-inscripcion-list',
  imports: [RouterLink, MatButtonModule, MatPaginatorModule, MatTableModule],
  templateUrl: './inscripcion-list.html',
  styleUrl: './inscripcion-list.scss',
})
export class InscripcionListComponent implements OnInit {
  private readonly inscripcionService = inject(InscripcionService);
  protected readonly pageSize = 10;

  protected readonly inscripciones = signal<InscripcionResponse[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly totalItems = signal(0);
  protected readonly totalPaginas = signal(0);
  protected readonly paginaActual = signal(0);

  ngOnInit(): void {
    this.cargarInscripciones();
  }

  protected cargarInscripciones(page = this.paginaActual()): void {
    this.cargando.set(true);
    this.error.set(null);

    this.inscripcionService.listar(page, this.pageSize).subscribe({
      next: (response) => {
        this.inscripciones.set(response.lista ?? []);
        this.totalItems.set(response.totalItems ?? 0);
        this.totalPaginas.set(response.totalPaginas ?? 0);
        this.paginaActual.set(response.numeroPagina ?? page);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de inscripciones.');
        this.cargando.set(false);
      },
    });
  }

  protected eliminarInscripcion(inscripcion: InscripcionResponse): void {
    const confirmado = window.confirm(`Desea eliminar la inscripcion de "${inscripcion.nombreEstudiante}"?`);

    if (!confirmado) {
      return;
    }

    this.inscripcionService.eliminar(inscripcion.codigoInscripcion).subscribe({
      next: () => this.cargarInscripciones(),
      error: () => this.error.set('No se pudo eliminar la inscripcion seleccionada.'),
    });
  }
}
