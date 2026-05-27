import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { CarreraRequest, CarreraResponse } from '../../core/models/carrera.model';
import { CarreraService } from '../../core/services/carrera.service';

@Component({
  selector: 'app-carrera-gestion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
  ],
  templateUrl: './carrera.html',
  styleUrls: ['./carrera.scss']
})
export class CarreraGestionComponent implements OnInit {
  carreraForm: FormGroup;
  displayedColumns: string[] = ['codigoCarrera', 'nombreCarrera', 'descripcion', 'acciones'];
  dataSource = new MatTableDataSource<CarreraResponse>();
  codigoCarreraSeleccionado: number | null = null;
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  cargando = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly carreraService: CarreraService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
    this.carreraForm = this.fb.group({
      nombreCarrera: ['', Validators.required],
      descripcion: ['']
    });
  }

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

  agregar(): void {
    if (this.carreraForm.invalid) {
      this.carreraForm.markAllAsTouched();
      return;
    }

    this.carreraService.crear(this.obtenerCarreraRequest()).subscribe({
      next: () => {
        this.cargarCarreras();
        this.limpiar();
      },
      error: (error) => console.error('Error al crear carrera', error)
    });
  }

  actualizar(): void {
    if (this.carreraForm.invalid || this.codigoCarreraSeleccionado === null) {
      this.carreraForm.markAllAsTouched();
      return;
    }

    this.carreraService.actualizar(this.codigoCarreraSeleccionado, this.obtenerCarreraRequest()).subscribe({
      next: () => {
        this.cargarCarreras();
        this.limpiar();
      },
      error: (error) => console.error('Error al actualizar carrera', error)
    });
  }

  eliminar(carrera: CarreraResponse): void {
    const confirmado = confirm(`Desea eliminar la carrera "${carrera.nombreCarrera}"?`);
    if (!confirmado) {
      return;
    }

    this.carreraService.eliminar(carrera.codigoCarrera).subscribe({
      next: () => this.cargarCarreras(),
      error: (error) => console.error('Error al eliminar carrera', error)
    });
  }

  editar(carrera: CarreraResponse): void {
    this.carreraService.buscarPorId(carrera.codigoCarrera).subscribe({
      next: (response) => {
        this.codigoCarreraSeleccionado = response.codigoCarrera;
        this.carreraForm.patchValue({
          nombreCarrera: response.nombreCarrera,
          descripcion: response.descripcion
        });
      },
      error: (error) => console.error('Error al buscar carrera', error)
    });
  }

  limpiar(): void {
    this.codigoCarreraSeleccionado = null;
    this.carreraForm.reset();
  }

  private obtenerCarreraRequest(): CarreraRequest {
    const formValue = this.carreraForm.getRawValue() as CarreraRequest;
    return {
      nombreCarrera: formValue.nombreCarrera,
      descripcion: formValue.descripcion ?? ''
    };
  }
}
