import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';

import { HorarioService } from '../../service/horario.service';

@Component({
  selector: 'app-horario-crear',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './horario-crear.html',
  styleUrl: './horario-crear.scss',
})
export class HorarioCrearComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly horarioService = inject(HorarioService);

  protected readonly dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

  protected readonly horarioForm = this.fb.nonNullable.group({
    dia: ['', [Validators.required, Validators.maxLength(20)]],
    horaInicio: ['', [Validators.required, Validators.maxLength(10)]],
    horaFin: ['', [Validators.required, Validators.maxLength(10)]],
    aula: ['', [Validators.required, Validators.maxLength(40)]],
  });

  protected guardando = false;
  protected error: string | null = null;

  protected guardar(): void {
    if (this.horarioForm.invalid) {
      this.horarioForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    this.horarioService.crear(this.horarioForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/layout/horarios']),
      error: () => {
        this.error = 'No se pudo crear el horario.';
        this.guardando = false;
      },
    });
  }
}
