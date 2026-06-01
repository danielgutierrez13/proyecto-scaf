import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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

  protected cargando = true;
  protected guardando = false;
  protected error: string | null = null;
  protected inscripcionId: number | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id) || id <= 0) {
      this.error = 'El identificador de inscripcion no es valido.';
      this.cargando = false;
      return;
    }

    this.inscripcionId = id;
    this.cargarCatalogos();
    this.cargarInscripcion(id);
  }

  protected guardar(): void {
    if (!this.inscripcionId) {
      return;
    }

    if (this.inscripcionForm.invalid) {
      this.inscripcionForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    this.inscripcionService.actualizar(this.inscripcionId, this.obtenerPayload()).subscribe({
      next: () => this.router.navigate(['/layout/inscripciones']),
      error: () => {
        this.error = 'No se pudo actualizar la inscripcion.';
        this.guardando = false;
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
    this.inscripcionService.buscarPorId(id).subscribe({
      next: (inscripcion) => {
        this.inscripcionForm.patchValue({
          codigoEstudiante: inscripcion.codigoEstudiante,
          codigoAsignacion: inscripcion.codigoAsignacion,
        });
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo encontrar la inscripcion solicitada.';
        this.cargando = false;
      },
    });
  }

  private cargarCatalogos(): void {
    this.usuarioService.listar(0, 100).subscribe({
      next: (response) => this.estudiantes.set(response.lista ?? []),
      error: () => this.error = 'No se pudieron cargar los estudiantes.',
    });

    this.asignacionService.listar(0, 100).subscribe({
      next: (response) => this.asignaciones.set(response.lista ?? []),
      error: () => this.error = 'No se pudieron cargar las asignaciones.',
    });
  }
}
