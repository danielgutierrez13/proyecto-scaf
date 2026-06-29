import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';

import { AsignacionResponse } from '../../../../core/models/asignacion.model';
import { InscripcionRequest } from '../../../../core/models/inscripcion.model';
import { UsuarioResponse } from '../../../../core/models/usuario.model';
import { AsignacionService } from '../../../asignacion/service/asignacion.service';
import { UsuarioService } from '../../../usuario/service/usuario.service';
import { InscripcionService } from '../../service/inscripcion.service';

@Component({
  selector: 'app-inscripcion-crear',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './inscripcion-crear.html',
  styleUrl: './inscripcion-crear.scss',
})
export class InscripcionCrearComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
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

  protected guardando = false;
  protected error: string | null = null;

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  protected guardar(): void {
    if (this.inscripcionForm.invalid) {
      this.inscripcionForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    this.inscripcionService.crear(this.obtenerPayload()).subscribe({
      next: () => this.router.navigate(['/layout/inscripciones']),
      error: () => {
        this.error = 'No se pudo crear la inscripcion.';
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

  private cargarCatalogos(): void {
    this.usuarioService.listarPorRol(0, 100, 'Estudiante').subscribe({
      next: (response) => this.estudiantes.set(response.lista ?? []),
      error: () => this.error = 'No se pudieron cargar los estudiantes.',
    });

    this.asignacionService.listar(0, 100).subscribe({
      next: (response) => this.asignaciones.set(response.lista ?? []),
      error: () => this.error = 'No se pudieron cargar las asignaciones.',
    });
  }
}
