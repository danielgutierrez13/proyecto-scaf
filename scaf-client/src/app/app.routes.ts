import { Routes } from '@angular/router';
import { Login } from './security/component/login/login';
import { Layout } from './layout/component/layout/layout';
import { CarreraGestionComponent } from './modules/carrera/carrera';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'layout',
    component: Layout,
    children: [
      { path: '', redirectTo: 'carreras', pathMatch: 'full' },
      { path: 'carreras', component: CarreraGestionComponent }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
