import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CursoResponse } from '../../../core/models/curso.model';
import { CursoService } from '../../../core/services/curso.service';

@Component({
  selector: 'app-curso-eliminar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './curso-eliminar.html',
  styleUrl: './curso-eliminar.scss',
})
export class CursoEliminarComponent implements OnInit {
  curso: CursoResponse | null = null;
  cargando = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cursoService: CursoService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/layout/cursos']);
      return;
    }

    this.cargarCurso(id);
  }

  eliminar(): void {
    if (!this.curso) {
      return;
    }

    this.cargando = true;
    this.cursoService.eliminar(this.curso.codigoCurso).subscribe({
      next: () => this.router.navigate(['/layout/cursos']),
      error: (error) => {
        console.error('Error al eliminar curso', error);
        this.cargando = false;
      },
    });
  }

  private cargarCurso(id: number): void {
    this.cargando = true;
    this.cursoService.buscarPorId(id).subscribe({
      next: (response) => {
        this.curso = response;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al buscar curso', error);
        this.cargando = false;
      },
    });
  }
}
