import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { AsignacionResponse } from '../../../../core/models/asignacion.model';
import { AsignacionService } from '../../../asignacion/service/asignacion.service';
import { AsistenciaService, ReconocimientoResponse } from '../../service/asistencia.service';

@Component({
  selector: 'app-asistencia',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './asistencia.html',
  styleUrl: './asistencia.scss',
})
export class AsistenciaComponent implements OnInit, OnDestroy {
  @ViewChild('videoEl') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasEl') canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly asistenciaService = inject(AsistenciaService);
  private readonly asignacionService = inject(AsignacionService);

  private stream: MediaStream | null = null;

  protected readonly asignaciones = signal<AsignacionResponse[]>([]);
  protected readonly resultado = signal<ReconocimientoResponse | null>(null);

  protected codigoAsignacionSeleccionada: number | null = null;
  protected camaraActiva = false;
  protected procesando = false;
  protected errorCamara: string | null = null;

  ngOnInit(): void {
    this.asignacionService.listar(0, 100).subscribe({
      next: (res) => this.asignaciones.set(res.lista ?? []),
      error: () => this.asignaciones.set([]),
    });
  }

  ngOnDestroy(): void {
    this.detenerCamara();
  }

  protected async abrirCamara(): Promise<void> {
    this.errorCamara = null;
    this.resultado.set(null);
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.camaraActiva = true;
      setTimeout(() => {
        if (this.videoRef?.nativeElement && this.stream) {
          this.videoRef.nativeElement.srcObject = this.stream;
        }
      }, 50);
    } catch {
      this.errorCamara = 'No se pudo acceder a la cámara. Verifica los permisos del navegador.';
    }
  }

  protected capturarFrame(): void {
    if (!this.videoRef?.nativeElement || !this.canvasRef?.nativeElement) return;
    if (!this.codigoAsignacionSeleccionada) return;

    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d')!.drawImage(video, 0, 0);

    const imagenBase64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
    this.detenerCamara();
    this.procesando = true;
    this.resultado.set(null);

    this.asistenciaService.reconocer(this.codigoAsignacionSeleccionada, imagenBase64).subscribe({
      next: (res) => { this.resultado.set(res); this.procesando = false; },
      error: () => {
        this.resultado.set({ estado: 'ERROR', mensaje: 'Error al procesar la asistencia.' });
        this.procesando = false;
      },
    });
  }

  protected reiniciar(): void {
    this.resultado.set(null);
    this.errorCamara = null;
  }

  protected detenerCamara(): void {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.camaraActiva = false;
  }
}
