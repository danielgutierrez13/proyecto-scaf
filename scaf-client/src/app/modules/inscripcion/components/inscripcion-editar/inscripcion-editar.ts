import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';

import { AsignacionResponse } from '../../../../core/models/asignacion.model';
import { InscripcionRequest } from '../../../../core/models/inscripcion.model';
import { UsuarioResponse } from '../../../../core/models/usuario.model';
import { AsignacionService } from '../../../asignacion/service/asignacion.service';
import { UsuarioService } from '../../../usuario/service/usuario.service';
import { InscripcionService } from '../../service/inscripcion.service';

@Component({
  selector: 'app-inscripcion-editar',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './inscripcion-editar.html',
  styleUrl: './inscripcion-editar.scss',
})
export class InscripcionEditarComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly inscripcionService = inject(InscripcionService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly asignacionService = inject(AsignacionService);

  protected readonly estudiantes = signal<UsuarioResponse[]>([]);
  protected readonly asignaciones = signal<AsignacionResponse[]>([]);

  protected readonly inscripcionForm = this.fb.group({
    codigoEstudiante: this.fb.control<number | null>(null, Validators.required),
    codigoAsignacion: this.fb.control<number | null>(null, Validators.required),
  });

  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected inscripcionId: number | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (!Number.isFinite(id) || id <= 0) {
        this.error.set('El identificador de inscripcion no es valido.');
        this.cargando.set(false);
        return;
      }

      this.inscripcionId = id;
      this.cargarInscripcion(id);
    });
  }

  protected guardar(): void {
    if (!this.inscripcionId) {
      return;
    }

    if (this.inscripcionForm.invalid) {
      this.inscripcionForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    this.inscripcionService.actualizar(this.inscripcionId, this.obtenerPayload()).subscribe({
      next: () => this.router.navigate(['/layout/inscripciones']),
      error: () => {
        this.error.set('No se pudo actualizar la inscripcion.');
        this.guardando.set(false);
      },
    });
  }

  private obtenerPayload(): InscripcionRequest {
    const { codigoEstudiante, codigoAsignacion } = this.inscripcionForm.getRawValue();

    return {
      codigoEstudiante: codigoEstudiante as number,
      codigoAsignacion: codigoAsignacion as number,
    };
  }

  private cargarInscripcion(id: number): void {
    this.cargando.set(true);
    this.error.set(null);

    forkJoin({
      inscripcion: this.inscripcionService.buscarPorId(id),
      estudiantes: this.usuarioService.listar(0, 100),
      asignaciones: this.asignacionService.listar(0, 100),
    }).pipe(
      finalize(() => this.cargando.set(false)),
    ).subscribe({
      next: ({ inscripcion, estudiantes, asignaciones }) => {
        this.estudiantes.set(estudiantes.lista ?? []);
        this.asignaciones.set(asignaciones.lista ?? []);
        this.inscripcionForm.patchValue({
          codigoEstudiante: inscripcion.codigoEstudiante ? Number(inscripcion.codigoEstudiante) : null,
          codigoAsignacion: inscripcion.codigoAsignacion ? Number(inscripcion.codigoAsignacion) : null,
        });
      },
      error: () => {
        this.error.set('No se pudo cargar la inscripcion solicitada.');
      },
    });
  }
}
