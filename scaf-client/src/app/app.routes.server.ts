import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'layout/carreras/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/carreras/eliminar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/cursos/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/cursos/eliminar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
