import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { CursoResponse } from '../../core/models/curso.model';
import { CursoService } from '../../core/services/curso.service';

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    RouterLink,
  ],
  templateUrl: './curso.html',
  styleUrl: './curso.scss',
})
export class CursoComponent implements OnInit {
  displayedColumns: string[] = ['codigoCurso', 'nombre', 'creditos', 'ciclo', 'modalidad', 'acciones'];
  dataSource = new MatTableDataSource<CursoResponse>();
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  cargando = false;

  constructor(
    private readonly cursoService: CursoService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.cargando = true;
    this.cursoService.listar(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.lista;
        this.totalItems = response.totalItems;
        this.pageIndex = response.numeroPagina;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al listar cursos', error);
        this.cargando = false;
      }
    });
  }

  cambiarPagina(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarCursos();
  }

  eliminar(curso: CursoResponse): void {
    const confirmado = confirm(`Desea eliminar el curso "${curso.nombre}"?`);
    if (!confirmado) {
      return;
    }

    this.cargando = true;
    this.cursoService.eliminar(curso.codigoCurso).subscribe({
      next: () => this.cargarCursos(),
      error: (error) => {
        console.error('Error al eliminar curso', error);
        this.cargando = false;
      }
    });
  }
}
