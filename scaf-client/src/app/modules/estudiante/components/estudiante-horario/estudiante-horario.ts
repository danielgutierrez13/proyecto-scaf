import { Component, OnInit, inject, signal } from '@angular/core';
import { InscripcionResponse } from '../../../../core/models/inscripcion.model';
import { AuthService } from '../../../../core/services/auth.service';
import { EstudianteService } from '../../service/estudiante.service';

@Component({
  selector: 'app-estudiante-horario',
  templateUrl: './estudiante-horario.html',
  styleUrl: './estudiante-horario.scss',
})
export class EstudianteHorarioComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly estudianteService = inject(EstudianteService);

  protected readonly DIAS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  protected readonly inscripciones = signal<InscripcionResponse[]>([]);
  protected cargando = true;
  protected error: string | null = null;

  ngOnInit(): void {
    const codigoEstudiante = this.auth.usuario()?.codigoUsuario;
    if (!codigoEstudiante) return;

    this.estudianteService.miHorario(codigoEstudiante).subscribe({
      next: (data) => { this.inscripciones.set(data); this.cargando = false; },
      error: () => { this.error = 'No se pudo cargar el horario.'; this.cargando = false; },
    });
  }

  /** Devuelve las inscripciones que corresponden al día dado. */
  protected cursosDelDia(dia: string): InscripcionResponse[] {
    return this.inscripciones().filter(
      (i) => i.dia?.toLowerCase() === dia.toLowerCase()
    );
  }
}
