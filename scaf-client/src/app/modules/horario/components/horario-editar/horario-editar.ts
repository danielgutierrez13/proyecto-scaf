import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { HorarioService } from '../../service/horario.service';

@Component({
  selector: 'app-horario-editar',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './horario-editar.html',
  styleUrl: './horario-editar.scss',
})
export class HorarioEditarComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly horarioService = inject(HorarioService);

  protected readonly dias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

  protected readonly horarioForm = this.fb.nonNullable.group({
    dia: ['', [Validators.required, Validators.maxLength(20)]],
    horaInicio: ['', [Validators.required, Validators.maxLength(10)]],
    horaFin: ['', [Validators.required, Validators.maxLength(10)]],
    aula: ['', [Validators.required, Validators.maxLength(40)]],
  });

  protected cargando = true;
  protected guardando = false;
  protected error: string | null = null;
  protected horarioId: number | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id) || id <= 0) {
      this.error = 'El identificador de horario no es valido.';
      this.cargando = false;
      return;
    }

    this.horarioId = id;
    this.cargarHorario(id);
  }

  protected guardar(): void {
    if (!this.horarioId) {
      return;
    }

    if (this.horarioForm.invalid) {
      this.horarioForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = null;

    this.horarioService.actualizar(this.horarioId, this.horarioForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/layout/horarios']),
      error: () => {
        this.error = 'No se pudo actualizar el horario.';
        this.guardando = false;
      },
    });
  }

  private cargarHorario(id: number): void {
    this.horarioService.buscarPorId(id).subscribe({
      next: (horario) => {
        this.horarioForm.patchValue({
          dia: horario.dia,
          horaInicio: horario.horaInicio,
          horaFin: horario.horaFin,
          aula: horario.aula,
        });
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudo encontrar el horario solicitado.';
        this.cargando = false;
      },
    });
  }
}
