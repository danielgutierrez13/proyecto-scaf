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

import { AsignacionRequest, AsignacionResponse } from '../../core/models/asignacion.model';
import { CicloAcademicoResponse } from '../../core/models/ciclo-academico.model';
import { CursoResponse } from '../../core/models/curso.model';
import { HorarioResponse } from '../../core/models/horario.model';
import { UsuarioResponse } from '../../core/models/usuario.model';
import { AsignacionService } from '../../core/services/asignacion.service';
import { CicloAcademicoService } from '../../core/services/ciclo-academico.service';
import { CursoService } from '../../core/services/curso.service';
import { HorarioService } from '../../core/services/horario.service';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-asignacion',
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
  templateUrl: './asignacion.html',
  styleUrl: './asignacion.scss',
})
export class AsignacionComponent implements OnInit {
  asignacionForm: FormGroup;
  displayedColumns: string[] = [
    'codigoAsignacion',
    'nombreDocente',
    'nombreCurso',
    'diaHorario',
    'descripcionCicloAcademico',
    'acciones',
  ];
  dataSource = new MatTableDataSource<AsignacionResponse>();
  docentes: UsuarioResponse[] = [];
  cursos: CursoResponse[] = [];
  horarios: HorarioResponse[] = [];
  ciclosAcademicos: CicloAcademicoResponse[] = [];
  totalItems = 0;
  pageSize = 10;
  pageIndex = 0;
  cargando = false;
  cargandoCatalogos = false;
  codigoAsignacionEditando: number | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly asignacionService: AsignacionService,
    private readonly usuarioService: UsuarioService,
    private readonly cursoService: CursoService,
    private readonly horarioService: HorarioService,
    private readonly cicloAcademicoService: CicloAcademicoService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
    this.asignacionForm = this.fb.group({
      codigoDocente: [null, Validators.required],
      codigoCurso: [null, Validators.required],
      codigoHorario: [null, Validators.required],
      codigoCicloAcademico: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.cargarCatalogos();
    this.cargarAsignaciones();
  }

  guardar(): void {
    if (this.asignacionForm.invalid) {
      this.asignacionForm.markAllAsTouched();
      return;
    }

    const request = this.obtenerAsignacionRequest();
    this.cargando = true;

    const operacion = this.codigoAsignacionEditando === null
      ? this.asignacionService.crear(request)
      : this.asignacionService.actualizar(this.codigoAsignacionEditando, request);

    operacion.subscribe({
      next: () => {
        this.limpiarFormulario();
        this.cargarAsignaciones();
      },
      error: (error) => {
        console.error('Error al guardar asignacion', error);
        this.cargando = false;
      },
    });
  }

  editar(asignacion: AsignacionResponse): void {
    this.codigoAsignacionEditando = asignacion.codigoAsignacion;
    this.asignacionForm.patchValue({
      codigoDocente: asignacion.codigoDocente,
      codigoCurso: asignacion.codigoCurso,
      codigoHorario: asignacion.codigoHorario,
      codigoCicloAcademico: asignacion.codigoCicloAcademico,
    });
  }

  eliminar(asignacion: AsignacionResponse): void {
    const confirmado = confirm(`Desea eliminar la asignacion de "${asignacion.nombreCurso}"?`);
    if (!confirmado) {
      return;
    }

    this.cargando = true;
    this.asignacionService.eliminar(asignacion.codigoAsignacion).subscribe({
      next: () => this.cargarAsignaciones(),
      error: (error) => {
        console.error('Error al eliminar asignacion', error);
        this.cargando = false;
      },
    });
  }

  limpiarFormulario(): void {
    this.codigoAsignacionEditando = null;
    this.asignacionForm.reset();
  }

  cambiarPagina(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarAsignaciones();
  }

  etiquetaDocente(docente: UsuarioResponse): string {
    return `${docente.nombres} ${docente.apellidos}`.trim();
  }

  etiquetaHorario(horario: HorarioResponse): string {
    return `${horario.dia} ${horario.horaInicio} - ${horario.horaFin} | ${horario.aula}`;
  }

  etiquetaCiclo(ciclo: CicloAcademicoResponse): string {
    return `${ciclo.descripcion} (${ciclo.anio}-${ciclo.semestre})`;
  }

  private cargarAsignaciones(): void {
    this.cargando = true;
    this.asignacionService.listar(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.lista;
        this.totalItems = response.totalItems;
        this.pageIndex = response.numeroPagina;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al listar asignaciones', error);
        this.cargando = false;
      },
    });
  }

  private cargarCatalogos(): void {
    this.cargandoCatalogos = true;
    forkJoin({
      usuarios: this.usuarioService.listar(0, 100),
      cursos: this.cursoService.listar(0, 100),
      horarios: this.horarioService.listar(0, 100),
      ciclosAcademicos: this.cicloAcademicoService.listar(0, 100),
    }).subscribe({
      next: ({ usuarios, cursos, horarios, ciclosAcademicos }) => {
        this.docentes = usuarios.lista.filter((usuario) => usuario.estado !== false);
        this.cursos = cursos.lista;
        this.horarios = horarios.lista;
        this.ciclosAcademicos = ciclosAcademicos.lista;
        this.cargandoCatalogos = false;
      },
      error: (error) => {
        console.error('Error al cargar catalogos de asignacion', error);
        this.cargandoCatalogos = false;
      },
    });
  }

  private obtenerAsignacionRequest(): AsignacionRequest {
    const formValue = this.asignacionForm.getRawValue();
    return {
      codigoDocente: Number(formValue.codigoDocente),
      codigoCurso: Number(formValue.codigoCurso),
      codigoHorario: Number(formValue.codigoHorario),
      codigoCicloAcademico: Number(formValue.codigoCicloAcademico),
    };
  }
}
