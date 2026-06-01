import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { AsignacionResponse } from '../../../../core/models/asignacion.model';
import { AsistenciaResponse, EstadoAsistencia } from '../../../../core/models/asistencia.model';
import { AsignacionService } from '../../../asignacion/service/asignacion.service';
import { AsistenciaService } from '../../service/asistencia.service';

@Component({
  selector: 'app-asistencia',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
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

  private readonly platformId = inject(PLATFORM_ID);
  private readonly asistenciaService = inject(AsistenciaService);
  private readonly asignacionService = inject(AsignacionService);

  private stream: MediaStream | null = null;

  protected readonly asignaciones = signal<AsignacionResponse[]>([]);
  protected readonly resultado = signal<AsistenciaResponse | null>(null);
  protected readonly modoDemo = signal(false);

  protected codigoAsignacionSeleccionada: number | null = null;
  protected camaraActiva = false;
  protected procesando = false;
  protected errorCamara: string | null = null;
  protected imagenCapturada: string | null = null;

  ngOnInit(): void {
    this.cargarAsignaciones();
  }

  ngOnDestroy(): void {
    this.detenerCamara();
  }

  private cargarAsignaciones(): void {
    this.asignacionService.listar(0, 100).subscribe({
      next: (res) => {
        this.asignaciones.set(res.lista ?? []);
      },
      error: () => {
        this.asignaciones.set([]);
      },
    });
  }

  protected async abrirCamara(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    this.errorCamara = null;
    this.imagenCapturada = null;
    this.resultado.set(null);

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
      });
      this.camaraActiva = true;

      // Necesitamos esperar a que el ViewChild esté disponible
      setTimeout(() => {
        if (this.videoRef?.nativeElement && this.stream) {
          this.videoRef.nativeElement.srcObject = this.stream;
        }
      }, 50);
    } catch {
      this.errorCamara = 'No se pudo acceder a la cámara. Verifique los permisos del navegador.';
    }
  }

  protected capturarFrame(): void {
    if (!this.videoRef?.nativeElement || !this.canvasRef?.nativeElement) return;

    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.imagenCapturada = canvas.toDataURL('image/jpeg', 0.85);

    this.detenerCamara();
    this.enviarAsistencia();
  }

  private enviarAsistencia(): void {
    if (!this.imagenCapturada || !this.codigoAsignacionSeleccionada) return;

    this.procesando = true;
    this.resultado.set(null);

    const base64 = this.imagenCapturada.split(',')[1];

    this.asistenciaService
      .tomarAsistencia({
        codigoAsignacion: this.codigoAsignacionSeleccionada,
        imagenBase64: base64,
      })
      .subscribe({
        next: (res) => {
          this.resultado.set(res);
          this.modoDemo.set(this.asistenciaService.esModoDemo());
          this.procesando = false;
        },
        error: () => {
          this.resultado.set({
            estado: 'ERROR',
            mensaje: 'Error inesperado al procesar la asistencia.',
          });
          this.procesando = false;
        },
      });
  }

  protected reiniciar(): void {
    this.imagenCapturada = null;
    this.resultado.set(null);
    this.errorCamara = null;
  }

  protected detenerCamara(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    this.camaraActiva = false;
  }

  protected iconoEstado(estado: EstadoAsistencia): string {
    switch (estado) {
      case 'RECONOCIDO':
        return '✅';
      case 'NO_RECONOCIDO':
        return '❓';
      default:
        return '⚠️';
    }
  }
}
