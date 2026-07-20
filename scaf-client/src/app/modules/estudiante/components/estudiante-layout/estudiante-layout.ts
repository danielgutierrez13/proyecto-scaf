import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { EstudianteService } from '../../service/estudiante.service';

@Component({
  selector: 'app-estudiante-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './estudiante-layout.html',
  styleUrl: './estudiante-layout.scss',
})
export class EstudianteLayoutComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly estudianteService = inject(EstudianteService);
  private readonly router = inject(Router);

  protected readonly usuario = this.auth.usuario;

  ngOnInit(): void {
    const usuario = this.auth.usuario();
    if (!usuario) return;

    // Si el estudiante no tiene rostro registrado lo manda a registrarlo
    this.estudianteService.tieneRostro(usuario.codigoUniversitario).subscribe({
      next: (res) => {
        if (!res.tieneRostro) {
          this.router.navigate(['/registro-rostro']);
        }
      },
    });
  }

  /** Estado del menu lateral en pantallas pequenas (drawer). */
  protected readonly menuAbierto = signal(false);

  protected alternarMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  protected cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  protected cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
