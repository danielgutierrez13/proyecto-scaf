import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';

import { CursoService } from '../../service/curso.service';

@Component({
  selector: 'app-curso-crear',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './curso-crear.html',
  styleUrl: './curso-crear.scss',
})
export class CursoCrearComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly cursoService = inject(CursoService);

  protected readonly modalidades = ['Presencial', 'Virtual', 'Semipresencial'];

  protected readonly cursoForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    creditos: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
    ciclo: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
    modalidad: ['', [Validators.required, Validators.maxLength(40)]],
  });

  protected guardando = false;
  protected error: string | null = null;

  protected guardar(): void {
    if (this.cursoForm.invalid) {
      this.cursoForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    this.cursoService.crear(this.cursoForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/layout/cursos']),
      error: () => {
        this.error = 'No se pudo crear el curso.';
        this.guardando = false;
      },
    });
  }
}
