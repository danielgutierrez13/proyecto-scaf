import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { forkJoin } from 'rxjs';

import { AsignacionResponse } from '../../core/models/asignacion.model';
import { InscripcionRequest, InscripcionResponse } from '../../core/models/inscripcion.model';
import { UsuarioResponse } from '../../core/models/usuario.model';
import { AsignacionService } from '../../core/services/asignacion.service';
import { InscripcionService } from '../../core/services/inscripcion.service';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-inscripcion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './inscripcion.html',
  styleUrl: './inscripcion.scss',
})
export class InscripcionComponent implements OnInit {
  inscripcionForm: FormGroup;
  displayedColumns: string[] = [
    'codigoInscripcion',
    'nombreEstudiante',
    'nombreCurso',
    'acciones',
  ];
  dataSource = new MatTableDataSource<InscripcionResponse>();
  estudiantes: UsuarioResponse[] = [];
  asignaciones: AsignacionResponse[] = [];
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  cargando = false;
  cargandoCatalogos = false;
  codigoInscripcionEditando: number | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly inscripcionService: InscripcionService,
    private readonly usuarioService: UsuarioService,
    private readonly asignacionService: AsignacionService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
    this.inscripcionForm = this.fb.group({
      codigoEstudiante: [null, Validators.required],
      codigoAsignacion: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.cargarCatalogos();
    this.cargarInscripciones();
  }

  guardar(): void {
    if (this.inscripcionForm.invalid) {
      this.inscripcionForm.markAllAsTouched();
      return;
    }

    const request = this.obtenerInscripcionRequest();
    this.cargando = true;

    const operacion = this.codigoInscripcionEditando === null
      ? this.inscripcionService.crear(request)
      : this.inscripcionService.actualizar(this.codigoInscripcionEditando, request);

    operacion.subscribe({
      next: () => {
        this.limpiarFormulario();
        this.cargarInscripciones();
      },
      error: (error) => {
        console.error('Error al guardar inscripcion', error);
        this.cargando = false;
      },
    });
  }

  editar(inscripcion: InscripcionResponse): void {
    this.codigoInscripcionEditando = inscripcion.codigoInscripcion;
    this.inscripcionForm.patchValue({
      codigoEstudiante: inscripcion.codigoEstudiante,
      codigoAsignacion: inscripcion.codigoAsignacion,
    });
  }

  eliminar(inscripcion: InscripcionResponse): void {
    const confirmado = confirm(`Desea eliminar la inscripcion de "${inscripcion.nombreEstudiante}"?`);
    if (!confirmado) {
      return;
    }

    this.cargando = true;
    this.inscripcionService.eliminar(inscripcion.codigoInscripcion).subscribe({
      next: () => this.cargarInscripciones(),
      error: (error) => {
        console.error('Error al eliminar inscripcion', error);
        this.cargando = false;
      },
    });
  }

  limpiarFormulario(): void {
    this.codigoInscripcionEditando = null;
    this.inscripcionForm.reset();
  }

  cambiarPagina(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarInscripciones();
  }

  etiquetaEstudiante(estudiante: UsuarioResponse): string {
    return `${estudiante.nombres} ${estudiante.apellidos}`.trim();
  }

  etiquetaAsignacion(asignacion: AsignacionResponse): string {
    const docente = asignacion.nombreDocente ? ` - ${asignacion.nombreDocente}` : '';
    const ciclo = asignacion.descripcionCicloAcademico ? ` (${asignacion.descripcionCicloAcademico})` : '';
    return `${asignacion.nombreCurso}${docente}${ciclo}`;
  }

  private cargarInscripciones(): void {
    this.cargando = true;
    this.inscripcionService.listar(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.lista;
        this.totalItems = response.totalItems;
        this.pageIndex = response.numeroPagina;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al listar inscripciones', error);
        this.cargando = false;
      },
    });
  }

  private cargarCatalogos(): void {
    this.cargandoCatalogos = true;
    forkJoin({
      usuarios: this.usuarioService.listar(0, 100),
      asignaciones: this.asignacionService.listar(0, 100),
    }).subscribe({
      next: ({ usuarios, asignaciones }) => {
        this.estudiantes = usuarios.lista.filter((usuario) => usuario.estado !== false);
        this.asignaciones = asignaciones.lista;
        this.cargandoCatalogos = false;
      },
      error: (error) => {
        console.error('Error al cargar catalogos de inscripcion', error);
        this.cargandoCatalogos = false;
      },
    });
  }

  private obtenerInscripcionRequest(): InscripcionRequest {
    const formValue = this.inscripcionForm.getRawValue();
    return {
      codigoEstudiante: Number(formValue.codigoEstudiante),
      codigoAsignacion: Number(formValue.codigoAsignacion),
    };
  }
}
