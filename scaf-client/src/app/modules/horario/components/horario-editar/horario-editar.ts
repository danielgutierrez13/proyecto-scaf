import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { HorarioService } from '../../service/horario.service';

@Component({
  selector: 'app-horario-editar',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './horario-editar.html',
  styleUrl: './horario-editar.scss',
})
export class HorarioEditarComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly horarioService = inject(HorarioService);

  protected readonly dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

  protected readonly horarioForm = this.fb.nonNullable.group({
    dia: ['', [Validators.required, Validators.maxLength(20)]],
    horaInicio: ['', [Validators.required, Validators.maxLength(10)]],
    horaFin: ['', [Validators.required, Validators.maxLength(10)]],
    aula: ['', [Validators.required, Validators.maxLength(40)]],
  });

  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected horarioId: number | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (!Number.isFinite(id) || id <= 0) {
        this.error.set('El identificador de horario no es valido.');
        this.cargando.set(false);
        return;
      }

      this.horarioId = id;
      this.cargarHorario(id);
    });
  }

  protected guardar(): void {
    if (!this.horarioId) {
      return;
    }

    if (this.horarioForm.invalid) {
      this.horarioForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    this.horarioService.actualizar(this.horarioId, this.horarioForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/layout/horarios']),
      error: () => {
        this.error.set('No se pudo actualizar el horario.');
        this.guardando.set(false);
      },
    });
  }

  private cargarHorario(id: number): void {
    this.cargando.set(true);
    this.error.set(null);

    this.horarioService.buscarPorId(id).pipe(
      finalize(() => this.cargando.set(false)),
    ).subscribe({
      next: (horario) => {
        this.horarioForm.patchValue({
          dia: horario.dia ?? '',
          horaInicio: horario.horaInicio ?? '',
          horaFin: horario.horaFin ?? '',
          aula: horario.aula ?? '',
        });
      },
      error: () => {
        this.error.set('No se pudo encontrar el horario solicitado.');
      },
    });
  }
}
