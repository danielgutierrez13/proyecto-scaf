import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected error: string | null = null;
  protected cargando = false;

  protected readonly loginForm = this.fb.nonNullable.group({
    codigoUniversitario: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected ingresar(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.error = null;
    const { codigoUniversitario, password } = this.loginForm.getRawValue();

    this.authService.login(codigoUniversitario, password).subscribe({
      next: (usuario) => {
        const rol = usuario.nombreRol?.toLowerCase() ?? '';
        if (rol.includes('estudiante')) {
          this.router.navigate(['/estudiante']);
        } else if (rol.includes('docente')) {
          this.router.navigate(['/docente']);
        } else {
          this.router.navigate(['/layout']);
        }
      },
      error: () => {
        this.error = 'Código o contraseña incorrectos, o usuario inactivo.';
        this.cargando = false;
      },
    });
  }
}
