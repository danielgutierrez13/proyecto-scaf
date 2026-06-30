import { Component, OnInit, inject, signal } from '@angular/core';
import { AsignacionResponse } from '../../../../core/models/asignacion.model';
import { AuthService } from '../../../../core/services/auth.service';
import { InscripcionService } from '../../../inscripcion/service/inscripcion.service';
import { EstudianteService } from '../../service/estudiante.service';

@Component({
  selector: 'app-estudiante-inscripciones',
  templateUrl: './estudiante-inscripciones.html',
  styleUrl: './estudiante-inscripciones.scss',
})
export class EstudianteInscripcionesComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly inscripcionService = inject(InscripcionService);
  private readonly estudianteService = inject(EstudianteService);

  protected readonly disponibles = signal<AsignacionResponse[]>([]);
  protected cargando = true;
  protected error: string | null = null;
  protected mensajeExito: string | null = null;
  protected inscribiendose: number | null = null;

  ngOnInit(): void {
    this.cargarDisponibles();
  }

  private cargarDisponibles(): void {
    const id = this.auth.usuario()?.codigoUsuario;
    if (!id) return;
    this.cargando = true;
    this.estudianteService.disponibles(id).subscribe({
      next: (data) => { this.disponibles.set(data); this.cargando = false; },
      error: () => { this.error = 'No se pudieron cargar los cursos disponibles.'; this.cargando = false; },
    });
  }

  protected inscribirse(codigoAsignacion: number): void {
    const codigoEstudiante = this.auth.usuario()?.codigoUsuario;
    if (!codigoEstudiante) return;

    this.inscribiendose = codigoAsignacion;
    this.mensajeExito = null;
    this.error = null;

    this.inscripcionService.crear({ codigoEstudiante, codigoAsignacion }).subscribe({
      next: () => {
        this.mensajeExito = 'Inscripción realizada con éxito.';
        this.inscribiendose = null;
        this.cargarDisponibles();
      },
      error: () => {
        this.error = 'No se pudo completar la inscripción.';
        this.inscribiendose = null;
      },
    });
  }
}
