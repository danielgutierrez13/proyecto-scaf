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
import { AsistenteHoy, AsistenciaService } from '../../../asistencia/service/asistencia.service';
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

  protected readonly curso         = signal<AsignacionResponse | null>(null);
  protected readonly cargando      = signal(true);
  protected readonly error         = signal<string | null>(null);
  protected readonly camaraActiva  = signal(false);
  protected readonly escaneando    = signal(false);
  protected readonly resultado     = signal<string | null>(null);
  protected readonly resultadoExito = signal(false);
  protected readonly asistentesHoy = signal<AsistenteHoy[]>([]);

  private stream: MediaStream | null = null;

  ngOnInit(): void {
    const codigoAsignacion = Number(this.route.snapshot.paramMap.get('codigoAsignacion'));

    this.docenteService.getCurso(codigoAsignacion).subscribe({
      next: (data) => {
        this.curso.set(data);
        this.cargando.set(false);
        this.cargarAsistentesHoy(codigoAsignacion);
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

      // DroidCam y cámaras virtuales necesitan un tick más largo para inicializar
      setTimeout(() => {
        const video = this.videoRef()?.nativeElement;
        if (video && this.stream) {
          video.srcObject = this.stream;
          video.play().catch((err) => {
            console.warn('Autoplay bloqueado, reintentando...', err);
            // Segundo intento tras interacción del usuario
            video.addEventListener('click', () => video.play(), { once: true });
          });
        }
      }, 150);
    } catch {
      this.error.set('No se pudo acceder a la cámara. Verifica los permisos del navegador.');
    }
  }

  private cargarAsistentesHoy(codigoAsignacion: number): void {
    this.asistenciaService.asistentesHoy(codigoAsignacion).subscribe({
      next: (data) => this.asistentesHoy.set(data),
    });
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
        const exito = res.estado === 'RECONOCIDO';
        this.resultadoExito.set(exito);
        this.resultado.set(
          exito
            ? `✅ Asistencia Registrada — ${res.nombreEstudiante}`
            : `❌ ${res.mensaje}`
        );
        if (exito) this.cargarAsistentesHoy(codigoAsignacion);
        this.escaneando.set(false);
      },
      error: () => {
        this.resultado.set('❌ Error al procesar el reconocimiento.');
        this.escaneando.set(false);
      },
    });
  }
}
