import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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

  protected cargando = true;
  protected guardando = false;
  protected error: string | null = null;
  protected asignacionId: number | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id) || id <= 0) {
      this.error = 'El identificador de asignacion no es valido.';
      this.cargando = false;
      return;
    }

    this.asignacionId = id;
    this.cargarCatalogos();
    this.cargarAsignacion(id);
  }

  protected guardar(): void {
    if (!this.asignacionId) {
      return;
    }

    if (this.asignacionForm.invalid) {
      this.asignacionForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    this.asignacionService.actualizar(this.asignacionId, this.obtenerPayload()).subscribe({
      next: () => this.router.navigate(['/layout/asignaciones']),
      error: () => {
        this.error = 'No se pudo actualizar la asignacion.';
        this.guardando = false;
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
    this.asignacionService.buscarPorId(id).subscribe({
      next: (asignacion) => {
        this.asignacionForm.patchValue({
          codigoDocente: asignacion.codigoDocente,
          codigoCurso: asignacion.codigoCurso,
          codigoHorario: asignacion.codigoHorario,
          codigoCicloAcademico: asignacion.codigoCicloAcademico,
        });
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo encontrar la asignacion solicitada.';
        this.cargando = false;
      },
    });
  }

  private cargarCatalogos(): void {
    this.usuarioService.listar(0, 100).subscribe({
      next: (response) => this.docentes.set(response.lista ?? []),
      error: () => this.error = 'No se pudieron cargar los docentes.',
    });

    this.cursoService.listar(0, 100).subscribe({
      next: (response) => this.cursos.set(response.lista ?? []),
      error: () => this.error = 'No se pudieron cargar los cursos.',
    });

    this.horarioService.listar(0, 100).subscribe({
      next: (response) => this.horarios.set(response.lista ?? []),
      error: () => this.error = 'No se pudieron cargar los horarios.',
    });

    this.cicloAcademicoService.listar(0, 100).subscribe({
      next: (response) => this.ciclos.set(response.lista ?? []),
      error: () => this.error = 'No se pudieron cargar los ciclos academicos.',
    });
  }
}
