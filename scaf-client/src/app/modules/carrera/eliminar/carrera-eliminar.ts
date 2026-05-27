import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CarreraResponse } from '../../../core/models/carrera.model';
import { CarreraService } from '../../../core/services/carrera.service';

@Component({
  selector: 'app-carrera-eliminar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './carrera-eliminar.html',
  styleUrl: './carrera-eliminar.scss',
})
export class CarreraEliminarComponent implements OnInit {
  carrera: CarreraResponse | null = null;
  cargando = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly carreraService: CarreraService,
    @Inject(PLATFORM_ID) private readonly platformId: object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/layout/carreras']);
      return;
    }

    this.cargarCarrera(id);
  }

  eliminar(): void {
    if (!this.carrera) {
      return;
    }

    this.cargando = true;
    this.carreraService.eliminar(this.carrera.codigoCarrera).subscribe({
      next: () => this.router.navigate(['/layout/carreras']),
      error: (error) => {
        console.error('Error al eliminar carrera', error);
        this.cargando = false;
      },
    });
  }

  private cargarCarrera(id: number): void {
    this.cargando = true;
    this.carreraService.buscarPorId(id).subscribe({
      next: (response) => {
        this.carrera = response;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al buscar carrera', error);
        this.cargando = false;
      },
    });
  }
}
