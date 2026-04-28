import { Routes } from '@angular/router';
import { Login } from './security/component/login/login';
import { Layout } from './layout/component/layout/layout';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'layout', component: Layout },
  { path: '**', redirectTo: '/login' }
];
