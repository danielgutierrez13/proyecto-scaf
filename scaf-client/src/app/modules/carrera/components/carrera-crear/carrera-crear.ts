import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';

import { CarreraService } from '../../service/carrera.service';

@Component({
  selector: 'app-carrera-crear',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './carrera-crear.html',
  styleUrl: './carrera-crear.scss',
})
export class CarreraCrearComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly carreraService = inject(CarreraService);

  protected readonly carreraForm = this.fb.nonNullable.group({
    nombreCarrera: ['', [Validators.required, Validators.maxLength(120)]],
    descripcion: ['', [Validators.required, Validators.maxLength(255)]],
  });

  protected guardando = false;
  protected error: string | null = null;

  protected guardar(): void {
    if (this.carreraForm.invalid) {
      this.carreraForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    this.carreraService.crear(this.carreraForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/layout/carreras']),
      error: () => {
        this.error = 'No se pudo crear la carrera.';
        this.guardando = false;
      },
    });
  }
}
