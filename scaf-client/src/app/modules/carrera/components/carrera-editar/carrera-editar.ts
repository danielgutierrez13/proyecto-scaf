import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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

  protected cargando = true;
  protected guardando = false;
  protected error: string | null = null;
  protected carreraId: number | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id) || id <= 0) {
      this.error = 'El identificador de carrera no es valido.';
      this.cargando = false;
      return;
    }

    this.carreraId = id;
    this.cargarCarrera(id);
  }

  protected guardar(): void {
    if (!this.carreraId) {
      return;
    }

    if (this.carreraForm.invalid) {
      this.carreraForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    this.carreraService.actualizar(this.carreraId, this.carreraForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/layout/carreras']),
      error: () => {
        this.error = 'No se pudo actualizar la carrera.';
        this.guardando = false;
      },
    });
  }

  private cargarCarrera(id: number): void {
    this.carreraService.buscarPorId(id).subscribe({
      next: (carrera) => {
        this.carreraForm.patchValue({
          nombreCarrera: carrera.nombreCarrera,
          descripcion: carrera.descripcion,
        });
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo encontrar la carrera solicitada.';
        this.cargando = false;
      },
    });
  }
}
