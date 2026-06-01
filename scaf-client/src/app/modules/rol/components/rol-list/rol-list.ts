import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { RolResponse } from '../../../../core/models/rol.model';
import { RolService } from '../../service/rol.service';

@Component({
  selector: 'app-rol-list',
  imports: [RouterLink, MatButtonModule, MatPaginatorModule, MatTableModule],
  templateUrl: './rol-list.html',
  styleUrl: './rol-list.scss',
})
export class RolListComponent implements OnInit {
  private readonly rolService = inject(RolService);
  protected readonly pageSize = 10;

  protected readonly roles = signal<RolResponse[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly totalItems = signal(0);
  protected readonly totalPaginas = signal(0);
  protected readonly paginaActual = signal(0);

  ngOnInit(): void {
    this.cargarRoles();
  }

  protected cargarRoles(page = this.paginaActual()): void {
    this.cargando.set(true);
    this.error.set(null);

    this.rolService.listar(page, this.pageSize).subscribe({
      next: (response) => {
        this.roles.set(response.lista ?? []);
        this.totalItems.set(response.totalItems ?? 0);
        this.totalPaginas.set(response.totalPaginas ?? 0);
        this.paginaActual.set(response.numeroPagina ?? page);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de roles.');
        this.cargando.set(false);
      },
    });
  }

  protected cambiarPagina(delta: number): void {
    const siguientePagina = this.paginaActual() + delta;

    if (siguientePagina < 0 || siguientePagina >= this.totalPaginas()) {
      return;
    }

    this.cargarRoles(siguientePagina);
  }

  protected eliminarRol(rol: RolResponse): void {
    const confirmado = window.confirm(`Desea eliminar el rol "${rol.nombreRol}"?`);

    if (!confirmado) {
      return;
    }

    this.rolService.eliminar(rol.codigoRol).subscribe({
      next: () => this.cargarRoles(),
      error: () => this.error.set('No se pudo eliminar el rol seleccionado.'),
    });
  }
}
