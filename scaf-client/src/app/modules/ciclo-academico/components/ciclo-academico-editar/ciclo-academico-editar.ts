import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { CicloAcademicoService } from '../../service/ciclo-academico.service';

@Component({
  selector: 'app-ciclo-academico-editar',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './ciclo-academico-editar.html',
  styleUrl: './ciclo-academico-editar.scss',
})
export class CicloAcademicoEditarComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cicloAcademicoService = inject(CicloAcademicoService);

  protected readonly cicloForm = this.fb.nonNullable.group({
    anio: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
    semestre: [1, [Validators.required, Validators.min(1), Validators.max(2)]],
    descripcion: ['', [Validators.required, Validators.maxLength(160)]],
  });

  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected cicloId: number | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (!Number.isFinite(id) || id <= 0) {
        this.error.set('El identificador de ciclo academico no es valido.');
        this.cargando.set(false);
        return;
      }

      this.cicloId = id;
      this.cargarCiclo(id);
    });
  }

  protected guardar(): void {
    if (!this.cicloId) {
      return;
    }

    if (this.cicloForm.invalid) {
      this.cicloForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    this.cicloAcademicoService.actualizar(this.cicloId, this.cicloForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/layout/ciclos-academicos']),
      error: () => {
        this.error.set('No se pudo actualizar el ciclo academico.');
        this.guardando.set(false);
      },
    });
  }

  private cargarCiclo(id: number): void {
    this.cargando.set(true);
    this.error.set(null);

    this.cicloAcademicoService.buscarPorId(id).pipe(
      finalize(() => this.cargando.set(false)),
    ).subscribe({
      next: (ciclo) => {
        this.cicloForm.patchValue({
          anio: Number(ciclo.anio),
          semestre: Number(ciclo.semestre),
          descripcion: ciclo.descripcion ?? '',
        });
      },
      error: () => {
        this.error.set('No se pudo encontrar el ciclo academico solicitado.');
      },
    });
  }
}
