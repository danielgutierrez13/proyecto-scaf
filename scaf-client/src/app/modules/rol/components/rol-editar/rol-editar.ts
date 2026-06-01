import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { RolService } from '../../service/rol.service';

@Component({
  selector: 'app-rol-editar',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './rol-editar.html',
  styleUrl: './rol-editar.scss',
})
export class RolEditarComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly rolService = inject(RolService);

  protected readonly rolForm = this.fb.nonNullable.group({
    nombreRol: ['', [Validators.required, Validators.maxLength(80)]],
    descripcion: ['', [Validators.required, Validators.maxLength(255)]],
  });

  protected cargando = true;
  protected guardando = false;
  protected error: string | null = null;
  protected rolId: number | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id) || id <= 0) {
      this.error = 'El identificador de rol no es valido.';
      this.cargando = false;
      return;
    }

    this.rolId = id;
    this.cargarRol(id);
  }

  protected guardar(): void {
    if (!this.rolId) {
      return;
    }

    if (this.rolForm.invalid) {
      this.rolForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    this.rolService.actualizar(this.rolId, this.rolForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/layout/roles']),
      error: () => {
        this.error = 'No se pudo actualizar el rol.';
        this.guardando = false;
      },
    });
  }

  private cargarRol(id: number): void {
    this.rolService.buscarPorId(id).subscribe({
      next: (rol) => {
        this.rolForm.patchValue({
          nombreRol: rol.nombreRol,
          descripcion: rol.descripcion,
        });
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo encontrar el rol solicitado.';
        this.cargando = false;
      },
    });
  }
}
