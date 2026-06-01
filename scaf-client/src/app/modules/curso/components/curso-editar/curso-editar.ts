import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { CursoService } from '../../service/curso.service';

@Component({
  selector: 'app-curso-editar',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './curso-editar.html',
  styleUrl: './curso-editar.scss',
})
export class CursoEditarComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cursoService = inject(CursoService);

  protected readonly modalidades = ['Presencial', 'Virtual', 'Semipresencial'];

  protected readonly cursoForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    creditos: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
    ciclo: [1, [Validators.required, Validators.min(1), Validators.max(12)]],
    modalidad: ['', [Validators.required, Validators.maxLength(40)]],
  });

  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected cursoId: number | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (!Number.isFinite(id) || id <= 0) {
        this.error.set('El identificador de curso no es valido.');
        this.cargando.set(false);
        return;
      }

      this.cursoId = id;
      this.cargarCurso(id);
    });
  }

  protected guardar(): void {
    if (!this.cursoId) {
      return;
    }

    if (this.cursoForm.invalid) {
      this.cursoForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    this.cursoService.actualizar(this.cursoId, this.cursoForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/layout/cursos']),
      error: () => {
        this.error.set('No se pudo actualizar el curso.');
        this.guardando.set(false);
      },
    });
  }

  private cargarCurso(id: number): void {
    this.cargando.set(true);
    this.error.set(null);

    this.cursoService.buscarPorId(id).pipe(
      finalize(() => this.cargando.set(false)),
    ).subscribe({
      next: (curso) => {
        this.cursoForm.patchValue({
          nombre: curso.nombre ?? '',
          creditos: Number(curso.creditos),
          ciclo: Number(curso.ciclo),
          modalidad: curso.modalidad ?? '',
        });
      },
      error: () => {
        this.error.set('No se pudo encontrar el curso solicitado.');
      },
    });
  }
}
