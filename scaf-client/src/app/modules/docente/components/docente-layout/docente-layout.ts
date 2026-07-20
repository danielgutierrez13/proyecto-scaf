import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-docente-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './docente-layout.html',
  styleUrl: './docente-layout.scss',
})
export class DocenteLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly usuario = this.auth.usuario;

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
