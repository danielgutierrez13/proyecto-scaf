import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { CarreraResponse } from '../../../../core/models/carrera.model';
import { CarreraService } from '../../service/carrera.service';

@Component({
  selector: 'app-carrera-gestion',
  imports: [RouterLink, MatButtonModule, MatPaginatorModule, MatTableModule],
  templateUrl: './carrera-list.html',
  styleUrl: './carrera-list.scss',
})
export class CarreraGestionComponent implements OnInit {
  private readonly carreraService = inject(CarreraService);
  protected readonly pageSize = 10;

  protected readonly carreras = signal<CarreraResponse[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly totalItems = signal(0);
  protected readonly totalPaginas = signal(0);
  protected readonly paginaActual = signal(0);

  ngOnInit(): void {
    this.cargarCarreras();
  }

  protected cargarCarreras(page = this.paginaActual()): void {
    this.cargando.set(true);
    this.error.set(null);

    this.carreraService.listar(page, this.pageSize).subscribe({
      next: (response) => {
        this.carreras.set(response.lista ?? []);
        this.totalItems.set(response.totalItems ?? 0);
        this.totalPaginas.set(response.totalPaginas ?? 0);
        this.paginaActual.set(response.numeroPagina ?? page);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de carreras.');
        this.cargando.set(false);
      },
    });
  }

  protected cambiarPagina(delta: number): void {
    const siguientePagina = this.paginaActual() + delta;

    if (siguientePagina < 0 || siguientePagina >= this.totalPaginas()) {
      return;
    }

    this.cargarCarreras(siguientePagina);
  }

  protected eliminarCarrera(carrera: CarreraResponse): void {
    const confirmado = window.confirm(`Desea eliminar la carrera "${carrera.nombreCarrera}"?`);

    if (!confirmado) {
      return;
    }

    this.carreraService.eliminar(carrera.codigoCarrera).subscribe({
      next: () => this.cargarCarreras(),
      error: () => this.error.set('No se pudo eliminar la carrera seleccionada.'),
    });
  }
}
