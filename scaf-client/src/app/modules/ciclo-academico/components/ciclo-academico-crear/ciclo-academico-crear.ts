import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';

import { CicloAcademicoService } from '../../service/ciclo-academico.service';

@Component({
  selector: 'app-ciclo-academico-crear',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './ciclo-academico-crear.html',
  styleUrl: './ciclo-academico-crear.scss',
})
export class CicloAcademicoCrearComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly cicloAcademicoService = inject(CicloAcademicoService);

  protected readonly cicloForm = this.fb.nonNullable.group({
    anio: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
    semestre: [1, [Validators.required, Validators.min(1), Validators.max(2)]],
    descripcion: ['', [Validators.required, Validators.maxLength(160)]],
  });

  protected guardando = false;
  protected error: string | null = null;

  protected guardar(): void {
    if (this.cicloForm.invalid) {
      this.cicloForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    this.cicloAcademicoService.crear(this.cicloForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/layout/ciclos-academicos']),
      error: () => {
        this.error = 'No se pudo crear el ciclo academico.';
        this.guardando = false;
      },
    });
  }
}
