import { Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { UsuarioService } from '../../../usuario/service/usuario.service';

const MAX_FOTOS = 10;

type Modo = 'camara' | 'subir';

@Component({
  selector: 'app-registro-rostro',
  templateUrl: './registro-rostro.html',
  styleUrl: './registro-rostro.scss',
})
export class RegistroRostroComponent {
  private readonly auth = inject(AuthService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly videoRef  = viewChild<ElementRef<HTMLVideoElement>>('videoElement');
  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvasElement');
  private readonly archivoRef = viewChild<ElementRef<HTMLInputElement>>('archivoInput');

  protected readonly fotos   = signal<string[]>([]);
  protected readonly modo    = signal<Modo>('camara');
  protected camaraActiva = false;
  protected guardando    = false;
  protected error: string | null = null;

  protected readonly MAX_FOTOS = MAX_FOTOS;

  private stream: MediaStream | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.detenerCamara());
  }

  // ── Selector de modo ────────────────────────────────────────────────────────

  protected seleccionarModo(m: Modo): void {
    this.detenerCamara();
    this.modo.set(m);
    if (m === 'camara') this.iniciarCamara();
  }

  // ── Cámara ──────────────────────────────────────────────────────────────────

  protected async iniciarCamara(): Promise<void> {
    this.error = null;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = this.videoRef()?.nativeElement;
      if (video) { video.srcObject = this.stream; this.camaraActiva = true; }
    } catch {
      this.error = 'No se pudo acceder a la cámara. Verifica los permisos del navegador.';
    }
  }

  protected detenerCamara(): void {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.camaraActiva = false;
  }

  protected capturarFoto(): void {
    if (this.fotos().length >= MAX_FOTOS) return;
    const video  = this.videoRef()?.nativeElement;
    const canvas = this.canvasRef()?.nativeElement;
    if (!video || !canvas) return;

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);
    this.fotos.update((f) => [...f, canvas.toDataURL('image/jpeg', 0.85)]);
  }

  // ── Subir archivos ──────────────────────────────────────────────────────────

  protected abrirSelector(): void {
    this.archivoRef()?.nativeElement.click();
  }

  protected onArchivosSeleccionados(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivos = Array.from(input.files ?? []);
    this.error = null;

    const disponibles = MAX_FOTOS - this.fotos().length;
    const aCargar = archivos.slice(0, disponibles);

    if (archivos.length > disponibles) {
      this.error = `Solo se pueden agregar ${disponibles} foto(s) más. Se ignoraron las restantes.`;
    }

    aCargar.forEach((archivo) => {
      if (!archivo.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        this.fotos.update((f) => [...f, dataUrl]);
      };
      reader.readAsDataURL(archivo);
    });

    // Resetea el input para permitir seleccionar los mismos archivos otra vez
    input.value = '';
  }

  // ── Galería compartida ──────────────────────────────────────────────────────

  protected eliminarFoto(index: number): void {
    this.fotos.update((f) => f.filter((_, i) => i !== index));
  }

  // ── Guardar ─────────────────────────────────────────────────────────────────

  protected guardar(): void {
    const usuario = this.auth.usuario();
    if (!usuario || this.fotos().length === 0) return;

    const formData = new FormData();
    this.fotos().forEach((dataUrl, i) => {
      formData.append('imagenes', this.dataUrlToBlob(dataUrl), `foto_${i + 1}.jpg`);
    });

    this.guardando = true;
    this.error = null;

    this.usuarioService.subirRostros(usuario.codigoUsuario, formData).subscribe({
      next: () => {
        this.detenerCamara();
        this.router.navigate(['/estudiante']);
      },
      error: () => {
        this.error = 'No se pudieron guardar las fotos. Intenta de nuevo.';
        this.guardando = false;
      },
    });
  }

  private dataUrlToBlob(dataUrl: string): Blob {
    const [header, data] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)![1];
    const bytes = atob(data);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }
}
