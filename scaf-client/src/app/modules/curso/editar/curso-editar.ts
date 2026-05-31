import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CursoRequest } from '../../../core/models/curso.model';
import { CursoService } from '../../../core/services/curso.service';

@Component({
  selector: 'app-curso-editar',
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
  templateUrl: './curso-editar.html',
  styleUrl: './curso-editar.scss',
})
export class CursoEditarComponent implements OnInit {
  cursoForm: FormGroup;
  codigoCurso: number | null = null;
  modalidades = ['Presencial', 'Virtual', 'Semipresencial'];
  cargando = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cursoService: CursoService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
    this.cursoForm = this.fb.group({
      nombre: ['', Validators.required],
      creditos: [null, [Validators.required, Validators.min(1)]],
      ciclo: [null, [Validators.required, Validators.min(1)]],
      modalidad: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/layout/cursos']);
      return;
    }

    this.codigoCurso = id;
    this.cargarCurso(id);
  }

  actualizar(): void {
    if (this.cursoForm.invalid || this.codigoCurso === null) {
      this.cursoForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.cursoService.actualizar(this.codigoCurso, this.obtenerCursoRequest()).subscribe({
      next: () => this.router.navigate(['/layout/cursos']),
      error: (error) => {
        console.error('Error al actualizar curso', error);
        this.cargando = false;
      },
    });
  }

  private cargarCurso(id: number): void {
    this.cargando = true;
    this.cursoService.buscarPorId(id).subscribe({
      next: (response) => {
        this.cursoForm.patchValue({
          nombre: response.nombre,
          creditos: response.creditos,
          ciclo: response.ciclo,
          modalidad: response.modalidad,
        });
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al buscar curso', error);
        this.cargando = false;
      },
    });
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
