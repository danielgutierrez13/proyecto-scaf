import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';

import { RolService } from '../../service/rol.service';

@Component({
  selector: 'app-rol-crear',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './rol-crear.html',
  styleUrl: './rol-crear.scss',
})
export class RolCrearComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly rolService = inject(RolService);

  protected readonly rolForm = this.fb.nonNullable.group({
    nombreRol: ['', [Validators.required, Validators.maxLength(80)]],
    descripcion: ['', [Validators.required, Validators.maxLength(255)]],
  });

  protected guardando = false;
  protected error: string | null = null;

  protected guardar(): void {
    if (this.rolForm.invalid) {
      this.rolForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    this.rolService.crear(this.rolForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/layout/roles']),
      error: () => {
        this.error = 'No se pudo crear el rol.';
        this.guardando = false;
      },
    });
  }
}
