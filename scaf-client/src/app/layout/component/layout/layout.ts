import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  private readonly authService = inject(AuthService);
  private readonly router      = inject(Router);

  /** Estado del menu lateral en pantallas pequenas (drawer). */
  protected readonly menuAbierto = signal(false);

  protected alternarMenu(): void {
    this.menuAbierto.update((abierto) => !abierto);
  }

  protected cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  protected cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  protected readonly menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'IN', route: '/layout/dashboard' },
    {
      label: 'Usuarios',
      icon: 'US',
      children: [
        { label: 'Roles', icon: 'S0', route: '/layout/roles' },
        { label: 'Usuarios', icon: 'S1', route: '/layout/usuarios' },
      ],
    },
    {
      label: 'Gestion',
      icon: 'GE',
      children: [
        { label: 'Carreras', icon: 'S4', route: '/layout/carreras' },
        { label: 'Cursos', icon: 'S1', route: '/layout/cursos' },
        { label: 'Horarios', icon: 'S3', route: '/layout/horarios' },
        { label: 'Ciclo Academico', icon: 'S2', route: '/layout/ciclos-academicos' },
        { label: 'Asignacion', icon: 'S2', route: '/layout/asignaciones' },
        { label: 'Inscripciones', icon: 'S5', route: '/layout/inscripciones' },
      ],
    },
    { label: 'Reportes', icon: 'RE', route: '/layout/reportes' },
  ];
}
