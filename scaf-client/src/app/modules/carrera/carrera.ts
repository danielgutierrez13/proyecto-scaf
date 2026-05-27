import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

import { CarreraResponse } from '../../core/models/carrera.model';
import { CarreraService } from '../../core/services/carrera.service';

@Component({
  selector: 'app-carrera-gestion',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    RouterLink,
  ],
  templateUrl: './carrera.html',
  styleUrls: ['./carrera.scss']
})
export class CarreraGestionComponent implements OnInit {
  displayedColumns: string[] = ['codigoCarrera', 'nombreCarrera', 'descripcion', 'acciones'];
  dataSource = new MatTableDataSource<CarreraResponse>();
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  cargando = false;

  constructor(
    private readonly carreraService: CarreraService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  ngOnInit(): void {
    this.cargarCarreras();
  }

  cargarCarreras(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.cargando = true;
    this.carreraService.listar(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.lista;
        this.totalItems = response.totalItems;
        this.pageIndex = response.numeroPagina;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al listar carreras', error);
        this.cargando = false;
      }
    });
  }

  cambiarPagina(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarCarreras();
  }
}
