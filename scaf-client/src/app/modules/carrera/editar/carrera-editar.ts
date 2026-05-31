import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CarreraRequest } from '../../../core/models/carrera.model';
import { CarreraService } from '../../../core/services/carrera.service';

@Component({
  selector: 'app-carrera-editar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './carrera-editar.html',
  styleUrl: './carrera-editar.scss',
})
export class CarreraEditarComponent implements OnInit {
  carreraForm: FormGroup;
  codigoCarrera: number | null = null;
  cargando = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly carreraService: CarreraService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {
    this.carreraForm = this.fb.group({
      nombreCarrera: ['', Validators.required],
      descripcion: [''],
    });
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/layout/carreras']);
      return;
    }

    this.codigoCarrera = id;
    this.cargarCarrera(id);
  }

  actualizar(): void {
    if (this.carreraForm.invalid || this.codigoCarrera === null) {
      this.carreraForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.carreraService.actualizar(this.codigoCarrera, this.obtenerCarreraRequest()).subscribe({
      next: () => this.router.navigate(['/layout/carreras']),
      error: (error) => {
        console.error('Error al actualizar carrera', error);
        this.cargando = false;
      },
    });
  }

  private cargarCarrera(id: number): void {
    this.cargando = true;
    this.carreraService.buscarPorId(id).subscribe({
      next: (response) => {
        this.carreraForm.patchValue({
          nombreCarrera: response.nombreCarrera,
          descripcion: response.descripcion,
        });
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al buscar carrera', error);
        this.cargando = false;
      },
    });
  }

  private obtenerCarreraRequest(): CarreraRequest {
    const formValue = this.carreraForm.getRawValue() as CarreraRequest;
    return {
      nombreCarrera: formValue.nombreCarrera,
      descripcion: formValue.descripcion ?? '',
    };
  }
}
