import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CarreraResponse } from '../../../../core/models/carrera.model';
import { RolResponse } from '../../../../core/models/rol.model';
import { CarreraService } from '../../../carrera/service/carrera.service';
import { RolService } from '../../../rol/service/rol.service';
import { UsuarioService } from '../../service/usuario.service';

@Component({
  selector: 'app-usuario-editar',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './usuario-editar.html',
  styleUrl: './usuario-editar.scss',
})
export class UsuarioEditarComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
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

  protected cargando = true;
  protected guardando = false;
  protected error: string | null = null;
  protected usuarioId: number | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id) || id <= 0) {
      this.error = 'El identificador de usuario no es valido.';
      this.cargando = false;
      return;
    }

    this.usuarioId = id;
    this.cargarCatalogos();
    this.cargarUsuario(id);
  }

  protected guardar(): void {
    if (!this.usuarioId) {
      return;
    }

    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    this.usuarioService.actualizar(this.usuarioId, this.usuarioForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/layout/usuarios']),
      error: () => {
        this.error = 'No se pudo actualizar el usuario.';
        this.guardando = false;
      },
    });
  }

  private cargarUsuario(id: number): void {
    this.usuarioService.buscarPorId(id).subscribe({
      next: (usuario) => {
        this.usuarioForm.patchValue({
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          codigoUniversitario: usuario.codigoUniversitario,
          correoInstitucional: usuario.correoInstitucional,
          password: '',
          telefono: usuario.telefono,
          codigoRol: usuario.codigoRol,
          fotoUsuario: usuario.fotoUsuario,
          codigoCarrera: usuario.codigoCarrera,
          estado: usuario.estado,
        });
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo encontrar el usuario solicitado.';
        this.cargando = false;
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
