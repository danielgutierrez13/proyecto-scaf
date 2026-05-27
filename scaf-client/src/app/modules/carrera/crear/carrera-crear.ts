import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';

import { CarreraRequest } from '../../../core/models/carrera.model';
import { CarreraService } from '../../../core/services/carrera.service';

@Component({
  selector: 'app-carrera-crear',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './carrera-crear.html',
  styleUrl: './carrera-crear.scss',
})
export class CarreraCrearComponent {
  carreraForm: FormGroup;
  cargando = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly carreraService: CarreraService,
    private readonly router: Router
  ) {
    this.carreraForm = this.fb.group({
      nombreCarrera: ['', Validators.required],
      descripcion: [''],
    });
  }

  guardar(): void {
    if (this.carreraForm.invalid) {
      this.carreraForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.carreraService.crear(this.obtenerCarreraRequest()).subscribe({
      next: () => this.router.navigate(['/layout/carreras']),
      error: (error) => {
        console.error('Error al crear carrera', error);
        this.cargando = false;
      },
    });
  }

  limpiar(): void {
    this.carreraForm.reset();
  }

  private obtenerCarreraRequest(): CarreraRequest {
    const formValue = this.carreraForm.getRawValue() as CarreraRequest;
    return {
      nombreCarrera: formValue.nombreCarrera,
      descripcion: formValue.descripcion ?? '',
    };
  }
}
