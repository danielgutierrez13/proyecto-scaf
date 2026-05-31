import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';

import { CursoRequest } from '../../../core/models/curso.model';
import { CursoService } from '../../../core/services/curso.service';

@Component({
  selector: 'app-curso-crear',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    RouterLink,
  ],
  templateUrl: './curso-crear.html',
  styleUrl: './curso-crear.scss',
})
export class CursoCrearComponent {
  cursoForm: FormGroup;
  modalidades = ['Presencial', 'Virtual', 'Semipresencial'];
  cargando = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly cursoService: CursoService,
    private readonly router: Router
  ) {
    this.cursoForm = this.fb.group({
      nombre: ['', Validators.required],
      creditos: [null, [Validators.required, Validators.min(1)]],
      ciclo: [null, [Validators.required, Validators.min(1)]],
      modalidad: ['', Validators.required],
    });
  }

  guardar(): void {
    if (this.cursoForm.invalid) {
      this.cursoForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.cursoService.crear(this.obtenerCursoRequest()).subscribe({
      next: () => this.router.navigate(['/layout/cursos']),
      error: (error) => {
        console.error('Error al crear curso', error);
        this.cargando = false;
      },
    });
  }

  limpiar(): void {
    this.cursoForm.reset();
  }

  private obtenerCursoRequest(): CursoRequest {
    const formValue = this.cursoForm.getRawValue();
    return {
      nombre: formValue.nombre,
      creditos: Number(formValue.creditos),
      ciclo: Number(formValue.ciclo),
      modalidad: formValue.modalidad,
    };
  }
}
