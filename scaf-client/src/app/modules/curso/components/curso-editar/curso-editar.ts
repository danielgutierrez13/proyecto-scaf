import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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

  protected cargando = true;
  protected guardando = false;
  protected error: string | null = null;
  protected cursoId: number | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id) || id <= 0) {
      this.error = 'El identificador de curso no es valido.';
      this.cargando = false;
      return;
    }

    this.cursoId = id;
    this.cargarCurso(id);
  }

  protected guardar(): void {
    if (!this.cursoId) {
      return;
    }

    if (this.cursoForm.invalid) {
      this.cursoForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    this.cursoService.actualizar(this.cursoId, this.cursoForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/layout/cursos']),
      error: () => {
        this.error = 'No se pudo actualizar el curso.';
        this.guardando = false;
      },
    });
  }

  private cargarCurso(id: number): void {
    this.cursoService.buscarPorId(id).subscribe({
      next: (curso) => {
        this.cursoForm.patchValue({
          nombre: curso.nombre,
          creditos: curso.creditos,
          ciclo: curso.ciclo,
          modalidad: curso.modalidad,
        });
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo encontrar el curso solicitado.';
        this.cargando = false;
      },
    });
  }
}
