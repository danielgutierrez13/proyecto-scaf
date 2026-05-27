import { Component } from '@angular/core';

interface MenuItem {
  label: string;
  icon: string;
  active?: boolean;
  children?: MenuItem[];
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  protected readonly menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'IN', active: true },
    {
      label: 'Usuarios',
      icon: 'US',
      children: [
        { label: 'Docentes', icon: 'S1' },
        { label: 'Estudiantes', icon: 'S2' },
      ],
    },
    {
      label: 'Gestion',
      icon: 'GE',
      children: [
        { label: 'Cursos', icon: 'S1' },
        { label: 'Asiganción', icon: 'S2' },
        { label: 'Horarios', icon: 'S3' },
        { label: 'Ciclo Académico', icon: 'S2' },
        { label: 'Carreras', icon: 'S4' },
        { label: 'Inscripciones', icon: 'S5' },
        { label: 'Asistencia', icon: 'S6' },
      ],
    },
    { label: 'Reportes', icon: 'RE' },
  ];
}
