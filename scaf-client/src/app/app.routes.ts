import { Routes } from '@angular/router';

import { Layout } from './layout/component/layout/layout';
import { CarreraCrearComponent } from './modules/carrera/crear/carrera-crear';
import { CarreraEditarComponent } from './modules/carrera/editar/carrera-editar';
import { CarreraEliminarComponent } from './modules/carrera/eliminar/carrera-eliminar';
import { CarreraGestionComponent } from './modules/carrera/carrera';
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
      { path: 'carreras/eliminar/:id', component: CarreraEliminarComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
