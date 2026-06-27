import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'layout/asignaciones',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/asignaciones/crear',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/asignaciones/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/carreras',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/carreras/crear',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/carreras/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/ciclos-academicos',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/ciclos-academicos/crear',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/ciclos-academicos/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/cursos',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/cursos/crear',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/cursos/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/horarios',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/horarios/crear',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/horarios/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/inscripciones',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/inscripciones/crear',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/inscripciones/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/roles',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/roles/crear',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/roles/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/usuarios',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/usuarios/crear',
    renderMode: RenderMode.Client
  },
  {
    path: 'layout/usuarios/editar/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
