import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { HorarioResponse } from '../../../../core/models/horario.model';
import { HorarioService } from '../../service/horario.service';

@Component({
  selector: 'app-horario-list',
  imports: [RouterLink, MatButtonModule, MatPaginatorModule, MatTableModule],
  templateUrl: './horario-list.html',
  styleUrl: './horario-list.scss',
})
export class HorarioListComponent implements OnInit {
  private readonly horarioService = inject(HorarioService);
  protected readonly pageSize = 10;

  protected readonly horarios = signal<HorarioResponse[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly totalItems = signal(0);
  protected readonly totalPaginas = signal(0);
  protected readonly paginaActual = signal(0);

  ngOnInit(): void {
    this.cargarHorarios();
  }

  protected cargarHorarios(page = this.paginaActual()): void {
    this.cargando.set(true);
    this.error.set(null);

    this.horarioService.listar(page, this.pageSize).subscribe({
      next: (response) => {
        this.horarios.set(response.lista ?? []);
        this.totalItems.set(response.totalItems ?? 0);
        this.totalPaginas.set(response.totalPaginas ?? 0);
        this.paginaActual.set(response.numeroPagina ?? page);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de horarios.');
        this.cargando.set(false);
      },
    });
  }

  protected cambiarPagina(delta: number): void {
    const siguientePagina = this.paginaActual() + delta;

    if (siguientePagina < 0 || siguientePagina >= this.totalPaginas()) {
      return;
    }

    this.cargarHorarios(siguientePagina);
  }

  protected eliminarHorario(horario: HorarioResponse): void {
    const confirmado = window.confirm(`Desea eliminar el horario de ${horario.dia} en aula ${horario.aula}?`);

    if (!confirmado) {
      return;
    }

    this.horarioService.eliminar(horario.codigoHorario).subscribe({
      next: () => this.cargarHorarios(),
      error: () => this.error.set('No se pudo eliminar el horario seleccionado.'),
    });
  }
}
