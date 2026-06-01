import { Routes } from '@angular/router';

import { Layout } from './layout/component/layout/layout';
import { AsignacionCrearComponent } from './modules/asignacion/components/asignacion-crear/asignacion-crear';
import { AsignacionEditarComponent } from './modules/asignacion/components/asignacion-editar/asignacion-editar';
import { AsignacionListComponent } from './modules/asignacion/components/asignacion-list/asignacion-list';
import { CarreraCrearComponent } from './modules/carrera/components/carrera-crear/carrera-crear';
import { CarreraEditarComponent } from './modules/carrera/components/carrera-editar/carrera-editar';
import { CarreraGestionComponent } from './modules/carrera/components/carrera-list/carrera-list';
import { CicloAcademicoCrearComponent } from './modules/ciclo-academico/components/ciclo-academico-crear/ciclo-academico-crear';
import { CicloAcademicoEditarComponent } from './modules/ciclo-academico/components/ciclo-academico-editar/ciclo-academico-editar';
import { CicloAcademicoListComponent } from './modules/ciclo-academico/components/ciclo-academico-list/ciclo-academico-list';
import { CursoCrearComponent } from './modules/curso/components/curso-crear/curso-crear';
import { CursoEditarComponent } from './modules/curso/components/curso-editar/curso-editar';
import { CursoListComponent } from './modules/curso/components/curso-list/curso-list';
import { HorarioCrearComponent } from './modules/horario/components/horario-crear/horario-crear';
import { HorarioEditarComponent } from './modules/horario/components/horario-editar/horario-editar';
import { HorarioListComponent } from './modules/horario/components/horario-list/horario-list';
import { RolCrearComponent } from './modules/rol/components/rol-crear/rol-crear';
import { RolEditarComponent } from './modules/rol/components/rol-editar/rol-editar';
import { RolListComponent } from './modules/rol/components/rol-list/rol-list';
import { UsuarioCrearComponent } from './modules/usuario/components/usuario-crear/usuario-crear';
import { UsuarioEditarComponent } from './modules/usuario/components/usuario-editar/usuario-editar';
import { UsuarioListComponent } from './modules/usuario/components/usuario-list/usuario-list';
import { Login } from './security/component/login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'layout',
    component: Layout,
    children: [
      { path: '', redirectTo: 'carreras', pathMatch: 'full' },
      { path: 'carreras', component: CarreraGestionComponent },
      { path: 'carreras/crear', component: CarreraCrearComponent },
      { path: 'carreras/editar/:id', component: CarreraEditarComponent },
      { path: 'ciclos-academicos', component: CicloAcademicoListComponent },
      { path: 'ciclos-academicos/crear', component: CicloAcademicoCrearComponent },
      { path: 'ciclos-academicos/editar/:id', component: CicloAcademicoEditarComponent },
      { path: 'cursos', component: CursoListComponent },
      { path: 'cursos/crear', component: CursoCrearComponent },
      { path: 'cursos/editar/:id', component: CursoEditarComponent },
      { path: 'horarios', component: HorarioListComponent },
      { path: 'horarios/crear', component: HorarioCrearComponent },
      { path: 'horarios/editar/:id', component: HorarioEditarComponent },
      { path: 'roles', component: RolListComponent },
      { path: 'roles/crear', component: RolCrearComponent },
      { path: 'roles/editar/:id', component: RolEditarComponent },
      { path: 'usuarios', component: UsuarioListComponent },
      { path: 'usuarios/crear', component: UsuarioCrearComponent },
      { path: 'usuarios/editar/:id', component: UsuarioEditarComponent },
      { path: 'asignaciones', component: AsignacionListComponent },
      { path: 'asignaciones/crear', component: AsignacionCrearComponent },
      { path: 'asignaciones/editar/:id', component: AsignacionEditarComponent },
    ]
  },
  { path: '**', redirectTo: '/login' }
];
