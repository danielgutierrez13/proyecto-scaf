import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function rolGuard(rolRequerido: string): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.estaAutenticado()) {
      router.navigate(['/login']);
      return false;
    }

    if (auth.esRol(rolRequerido)) return true;

    // Redirige al portal correcto según el rol actual
    const rol = auth.usuario()?.nombreRol?.toLowerCase() ?? '';
    if (rol.includes('estudiante')) router.navigate(['/estudiante']);
    else if (rol.includes('docente')) router.navigate(['/docente']);
    else router.navigate(['/layout']);

    return false;
  };
}
