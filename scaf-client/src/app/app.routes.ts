import { Routes } from '@angular/router';

import { Layout } from './layout/component/layout/layout';
import { AsignacionComponent } from './modules/asignacion/asignacion';
import { CarreraCrearComponent } from './modules/carrera/crear/carrera-crear';
import { CarreraEditarComponent } from './modules/carrera/editar/carrera-editar';
import { CarreraEliminarComponent } from './modules/carrera/eliminar/carrera-eliminar';
import { CarreraGestionComponent } from './modules/carrera/carrera';
import { CursoCrearComponent } from './modules/curso/crear/curso-crear';
import { CursoEditarComponent } from './modules/curso/editar/curso-editar';
import { CursoEliminarComponent } from './modules/curso/eliminar/curso-eliminar';
import { CursoComponent } from './modules/curso/curso';
import { Login } from './security/component/login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'layout',
    component: Layout,
    children: [
      { path: 'carreras', component: CarreraGestionComponent },
      { path: 'carreras/crear', component: CarreraCrearComponent },
      { path: 'carreras/editar/:id', component: CarreraEditarComponent },
      { path: 'carreras/eliminar/:id', component: CarreraEliminarComponent },
      { path: 'cursos', component: CursoComponent },
      { path: 'cursos/crear', component: CursoCrearComponent },
      { path: 'cursos/editar/:id', component: CursoEditarComponent },
      { path: 'cursos/eliminar/:id', component: CursoEliminarComponent },
      { path: 'asignaciones', component: AsignacionComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
