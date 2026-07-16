import {
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsignacionResponse } from '../../../../core/models/asignacion.model';
import { AsistenciaService } from '../../../asistencia/service/asistencia.service';
import { DocenteService } from '../../service/docente.service';

@Component({
  selector: 'app-docente-curso-detalle',
  imports: [RouterLink],
  templateUrl: './docente-curso-detalle.html',
  styleUrl: './docente-curso-detalle.scss',
})
export class DocenteCursoDetalleComponent implements OnInit {
  private readonly route             = inject(ActivatedRoute);
  private readonly docenteService    = inject(DocenteService);
  private readonly asistenciaService = inject(AsistenciaService);
  private readonly destroyRef        = inject(DestroyRef);

  private readonly videoRef  = viewChild<ElementRef<HTMLVideoElement>>('videoElement');
  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvasElement');

  protected readonly curso      = signal<AsignacionResponse | null>(null);
  protected readonly cargando   = signal(true);
  protected readonly error      = signal<string | null>(null);
  protected readonly camaraActiva = signal(false);
  protected readonly escaneando   = signal(false);
  protected readonly resultado    = signal<string | null>(null);

  private stream: MediaStream | null = null;

  ngOnInit(): void {
    const codigoAsignacion = Number(this.route.snapshot.paramMap.get('codigoAsignacion'));

    this.docenteService.getCurso(codigoAsignacion).subscribe({
      next: (data) => {
        this.curso.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set(`Error ${err?.status ?? ''}: No se pudo cargar el curso.`);
        this.cargando.set(false);
      },
    });

    this.destroyRef.onDestroy(() => this.cerrarCamara());
  }

  protected async iniciarCamara(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.resultado.set(null);
      this.error.set(null);
      this.camaraActiva.set(true);

      // Esperar al siguiente ciclo para que Angular renderice el <video>
      setTimeout(() => {
        const video = this.videoRef()?.nativeElement;
        if (video && this.stream) {
          video.srcObject = this.stream;
          video.play().catch(() => {});
        }
      }, 0);
    } catch {
      this.error.set('No se pudo acceder a la cámara. Verifica los permisos del navegador.');
    }
  }

  protected cerrarCamara(): void {
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
    this.camaraActiva.set(false);
    this.resultado.set(null);
  }

  protected capturarYReconocer(): void {
    const codigoAsignacion = this.curso()?.codigoAsignacion;
    if (!codigoAsignacion) return;

    const video  = this.videoRef()?.nativeElement;
    const canvas = this.canvasRef()?.nativeElement;
    if (!video || !canvas) return;

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);

    const imagenBase64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
    this.escaneando.set(true);
    this.resultado.set(null);

    this.asistenciaService.reconocer(codigoAsignacion, imagenBase64).subscribe({
      next: (res) => {
        this.resultado.set(
          res.estado === 'RECONOCIDO'
            ? `✅ Asistencia Registrada — ${res.nombreEstudiante}`
            : `❌ ${res.mensaje}`
        );
        this.escaneando.set(false);
      },
      error: () => {
        this.resultado.set('❌ Error al procesar el reconocimiento.');
        this.escaneando.set(false);
      },
    });
  }
}
