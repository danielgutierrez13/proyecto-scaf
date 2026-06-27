import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';

import { AsignacionRequest } from '../../../../core/models/asignacion.model';
import { CicloAcademicoResponse } from '../../../../core/models/ciclo-academico.model';
import { CursoResponse } from '../../../../core/models/curso.model';
import { HorarioResponse } from '../../../../core/models/horario.model';
import { UsuarioResponse } from '../../../../core/models/usuario.model';
import { CicloAcademicoService } from '../../../ciclo-academico/service/ciclo-academico.service';
import { CursoService } from '../../../curso/service/curso.service';
import { HorarioService } from '../../../horario/service/horario.service';
import { UsuarioService } from '../../../usuario/service/usuario.service';
import { AsignacionService } from '../../service/asignacion.service';

@Component({
  selector: 'app-asignacion-editar',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './asignacion-editar.html',
  styleUrl: './asignacion-editar.scss',
})
export class AsignacionEditarComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly asignacionService = inject(AsignacionService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly cursoService = inject(CursoService);
  private readonly horarioService = inject(HorarioService);
  private readonly cicloAcademicoService = inject(CicloAcademicoService);

  protected readonly docentes = signal<UsuarioResponse[]>([]);
  protected readonly cursos = signal<CursoResponse[]>([]);
  protected readonly horarios = signal<HorarioResponse[]>([]);
  protected readonly ciclos = signal<CicloAcademicoResponse[]>([]);

  protected readonly asignacionForm = this.fb.group({
    codigoDocente: this.fb.control<number | null>(null, Validators.required),
    codigoCurso: this.fb.control<number | null>(null, Validators.required),
    codigoHorario: this.fb.control<number | null>(null, Validators.required),
    codigoCicloAcademico: this.fb.control<number | null>(null, Validators.required),
  });

  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected asignacionId: number | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (!Number.isFinite(id) || id <= 0) {
        this.error.set('El identificador de asignacion no es valido.');
        this.cargando.set(false);
        return;
      }

      this.asignacionId = id;
      this.cargarAsignacion(id);
    });
  }

  protected guardar(): void {
    if (!this.asignacionId) {
      return;
    }

    if (this.asignacionForm.invalid) {
      this.asignacionForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    this.asignacionService.actualizar(this.asignacionId, this.obtenerPayload()).subscribe({
      next: () => this.router.navigate(['/layout/asignaciones']),
      error: () => {
        this.error.set('No se pudo actualizar la asignacion.');
        this.guardando.set(false);
      },
    });
  }

  private obtenerPayload(): AsignacionRequest {
    const { codigoDocente, codigoCurso, codigoHorario, codigoCicloAcademico } = this.asignacionForm.getRawValue();

    return {
      codigoDocente: codigoDocente as number,
      codigoCurso: codigoCurso as number,
      codigoHorario: codigoHorario as number,
      codigoCicloAcademico: codigoCicloAcademico as number,
    };
  }

  private cargarAsignacion(id: number): void {
    this.cargando.set(true);
    this.error.set(null);

    forkJoin({
      asignacion: this.asignacionService.buscarPorId(id),
      docentes: this.usuarioService.listarPorRol(0, 100, 'DOCENTE'),
      cursos: this.cursoService.listar(0, 100),
      horarios: this.horarioService.listar(0, 100),
      ciclos: this.cicloAcademicoService.listar(0, 100),
    }).pipe(
      finalize(() => this.cargando.set(false)),
    ).subscribe({
      next: ({ asignacion, docentes, cursos, horarios, ciclos }) => {
        this.docentes.set(docentes.lista ?? []);
        this.cursos.set(cursos.lista ?? []);
        this.horarios.set(horarios.lista ?? []);
        this.ciclos.set(ciclos.lista ?? []);
        this.asignacionForm.patchValue({
          codigoDocente: asignacion.codigoDocente ? Number(asignacion.codigoDocente) : null,
          codigoCurso: asignacion.codigoCurso ? Number(asignacion.codigoCurso) : null,
          codigoHorario: asignacion.codigoHorario ? Number(asignacion.codigoHorario) : null,
          codigoCicloAcademico: asignacion.codigoCicloAcademico ? Number(asignacion.codigoCicloAcademico) : null,
        });
      },
      error: () => {
        this.error.set('No se pudo cargar la asignacion solicitada.');
      },
    });
  }
}
