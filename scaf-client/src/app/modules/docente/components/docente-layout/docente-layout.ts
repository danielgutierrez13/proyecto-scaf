import { Component, inject } from '@angular/core';
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

  protected cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
