import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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
  protected readonly menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'IN', route: '/layout' },
    {
      label: 'Usuarios',
      icon: 'US',
      children: [
        { label: 'Roles', icon: 'S0', route: '/layout/roles' },
        { label: 'Usuarios', icon: 'S1', route: '/layout/usuarios' },
        { label: 'Docentes', icon: 'S1' },
        { label: 'Estudiantes', icon: 'S2' },
      ],
    },
    {
      label: 'Gestion',
      icon: 'GE',
      children: [
        { label: 'Cursos', icon: 'S1', route: '/layout/cursos' },
        { label: 'Asignacion', icon: 'S2', route: '/layout/asignaciones' },
        { label: 'Horarios', icon: 'S3', route: '/layout/horarios' },
        { label: 'Ciclo Academico', icon: 'S2', route: '/layout/ciclos-academicos' },
        { label: 'Carreras', icon: 'S4', route: '/layout/carreras' },
        { label: 'Inscripciones', icon: 'S5', route: '/layout/inscripciones' },
        { label: 'Asistencia', icon: 'S6' },
      ],
    },
    { label: 'Reportes', icon: 'RE' },
  ];
}
