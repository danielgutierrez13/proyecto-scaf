import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { UsuarioResponse } from '../../../../core/models/usuario.model';
import { UsuarioService } from '../../service/usuario.service';

@Component({
  selector: 'app-usuario-list',
  imports: [RouterLink, MatButtonModule, MatPaginatorModule, MatTableModule],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.scss',
})
export class UsuarioListComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  protected readonly pageSize = 10;

  protected readonly usuarios = signal<UsuarioResponse[]>([]);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly totalItems = signal(0);
  protected readonly totalPaginas = signal(0);
  protected readonly paginaActual = signal(0);

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  protected cargarUsuarios(page = this.paginaActual()): void {
    this.cargando.set(true);
    this.error.set(null);

    this.usuarioService.listar(page, this.pageSize).subscribe({
      next: (response) => {
        this.usuarios.set(response.lista ?? []);
        this.totalItems.set(response.totalItems ?? 0);
        this.totalPaginas.set(response.totalPaginas ?? 0);
        this.paginaActual.set(response.numeroPagina ?? page);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de usuarios.');
        this.cargando.set(false);
      },
    });
  }

  protected cambiarPagina(delta: number): void {
    const siguientePagina = this.paginaActual() + delta;

    if (siguientePagina < 0 || siguientePagina >= this.totalPaginas()) {
      return;
    }

    this.cargarUsuarios(siguientePagina);
  }

  protected eliminarUsuario(usuario: UsuarioResponse): void {
    const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`.trim();
    const confirmado = window.confirm(`Desea eliminar el usuario "${nombreCompleto}"?`);

    if (!confirmado) {
      return;
    }

    this.usuarioService.eliminar(usuario.codigoUsuario).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => this.error.set('No se pudo eliminar el usuario seleccionado.'),
    });
  }
}
