import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { CarreraService } from '../../service/carrera.service';

@Component({
  selector: 'app-carrera-editar',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './carrera-editar.html',
  styleUrl: './carrera-editar.scss',
})
export class CarreraEditarComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly carreraService = inject(CarreraService);

  protected readonly carreraForm = this.fb.nonNullable.group({
    nombreCarrera: ['', [Validators.required, Validators.maxLength(120)]],
    descripcion: ['', [Validators.required, Validators.maxLength(255)]],
  });

  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected carreraId: number | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));

      if (!Number.isFinite(id) || id <= 0) {
        this.error.set('El identificador de carrera no es valido.');
        this.cargando.set(false);
        return;
      }

      this.carreraId = id;
      this.cargarCarrera(id);
    });
  }

  protected guardar(): void {
    if (!this.carreraId) {
      return;
    }

    if (this.carreraForm.invalid) {
      this.carreraForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    this.carreraService.actualizar(this.carreraId, this.carreraForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/layout/carreras']),
      error: () => {
        this.error.set('No se pudo actualizar la carrera.');
        this.guardando.set(false);
      },
    });
  }

  private cargarCarrera(id: number): void {
    this.cargando.set(true);
    this.error.set(null);

    this.carreraService.buscarPorId(id).pipe(
      finalize(() => this.cargando.set(false)),
    ).subscribe({
      next: (carrera) => {
        this.carreraForm.patchValue({
          nombreCarrera: carrera.nombreCarrera ?? '',
          descripcion: carrera.descripcion ?? '',
        });
      },
      error: () => {
        this.error.set('No se pudo encontrar la carrera solicitada.');
      },
    });
  }
}
