import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';

import { CarreraResponse } from '../../../../core/models/carrera.model';
import { RolResponse } from '../../../../core/models/rol.model';
import { CarreraService } from '../../../carrera/service/carrera.service';
import { RolService } from '../../../rol/service/rol.service';
import { UsuarioService } from '../../service/usuario.service';

@Component({
  selector: 'app-usuario-crear',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './usuario-crear.html',
  styleUrl: './usuario-crear.scss',
})
export class UsuarioCrearComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly usuarioService = inject(UsuarioService);
  private readonly rolService = inject(RolService);
  private readonly carreraService = inject(CarreraService);

  protected readonly roles = signal<RolResponse[]>([]);
  protected readonly carreras = signal<CarreraResponse[]>([]);

  protected readonly usuarioForm = this.fb.nonNullable.group({
    nombres: ['', [Validators.required, Validators.maxLength(120)]],
    apellidos: ['', [Validators.required, Validators.maxLength(120)]],
    codigoUniversitario: ['', [Validators.required, Validators.maxLength(30)]],
    correoInstitucional: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(80)]],
    telefono: ['', [Validators.required, Validators.maxLength(20)]],
    codigoRol: this.fb.control<number | null>(null, Validators.required),
    fotoUsuario: ['', Validators.maxLength(255)],
    codigoCarrera: this.fb.control<number | null>(null, Validators.required),
    estado: [true],
  });

  protected guardando = false;
  protected error: string | null = null;

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  protected guardar(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    this.usuarioService.crear(this.usuarioForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/layout/usuarios']),
      error: () => {
        this.error = 'No se pudo crear el usuario.';
        this.guardando = false;
      },
    });
  }

  private cargarCatalogos(): void {
    this.rolService.listar(0, 100).subscribe({
      next: (response) => this.roles.set(response.lista ?? []),
      error: () => this.error = 'No se pudieron cargar los roles.',
    });

    this.carreraService.listar(0, 100).subscribe({
      next: (response) => this.carreras.set(response.lista ?? []),
      error: () => this.error = 'No se pudieron cargar las carreras.',
    });
  }
}
