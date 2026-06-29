import {
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

import { CarreraResponse } from '../../../../core/models/carrera.model';
import { RolResponse } from '../../../../core/models/rol.model';
import { CarreraService } from '../../../carrera/service/carrera.service';
import { RolService } from '../../../rol/service/rol.service';
import { UsuarioService } from '../../service/usuario.service';

@Component({
  selector: 'app-usuario-crear',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './usuario-crear.html',
  styleUrl: './usuario-crear.scss',
})
export class UsuarioCrearComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly usuarioService = inject(UsuarioService);
  private readonly rolService = inject(RolService);
  private readonly carreraService = inject(CarreraService);

  private readonly videoRef    = viewChild<ElementRef<HTMLVideoElement>>('videoElement');
  private readonly canvasRef   = viewChild<ElementRef<HTMLCanvasElement>>('canvasElement');
  private readonly archivoInput = viewChild<ElementRef<HTMLInputElement>>('archivoInput');

  protected readonly roles = signal<RolResponse[]>([]);
  protected readonly carreras = signal<CarreraResponse[]>([]);

  /** Rol actualmente seleccionado (sincronizado con el formulario) */
  protected readonly codigoRolSeleccionado = signal<number | null>(null);

  protected readonly rolEsEstudiante = computed(() => {
    const codigoRol = this.codigoRolSeleccionado();
    const lista = this.roles();
    if (!codigoRol || !lista.length) return false;
    const rol = lista.find(r => r.codigoRol === codigoRol);
    return rol?.nombreRol?.toLowerCase().includes('estudiante') ?? false;
  });

  protected readonly usuarioForm = this.fb.nonNullable.group({
    nombres: ['', [Validators.required, Validators.maxLength(120)]],
    apellidos: ['', [Validators.required, Validators.maxLength(120)]],
    codigoUniversitario: ['', [Validators.required, Validators.maxLength(30)]],
    correoInstitucional: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(80)]],
    telefono: ['', [Validators.required, Validators.maxLength(20)]],
    codigoRol: this.fb.control<number | null>(null, Validators.required),
    codigoCarrera: this.fb.control<number | null>(null, Validators.required),
    estado: [true],
  });

  protected guardando = false;
  protected error: string | null = null;

  // — Modo rostro —
  protected readonly modoRostro = signal<'camara' | 'subir'>('camara');
  private stream: MediaStream | null = null;
  protected readonly camaraActiva = signal(false);
  protected readonly fotosCapturadas = signal<string[]>([]);
  protected readonly MAX_FOTOS = 5;

  ngOnInit(): void {
    this.cargarCatalogos();

    // Sincroniza la señal cuando cambia el rol en el formulario
    this.usuarioForm.controls.codigoRol.valueChanges.subscribe(val => {
      this.codigoRolSeleccionado.set(val);
      // Si deja de ser estudiante, limpia las fotos y detiene la cámara
      if (!this.rolEsEstudiante()) {
        this.detenerCamara();
        this.fotosCapturadas.set([]);
      }
    });

    this.destroyRef.onDestroy(() => this.detenerCamara());
  }

  // ── Modo ───────────────────────────────────────────────────────────────────

  protected seleccionarModo(modo: 'camara' | 'subir'): void {
    this.detenerCamara();
    this.modoRostro.set(modo);
  }

  protected abrirSelector(): void {
    this.archivoInput()?.nativeElement.click();
  }

  protected onArchivosSeleccionados(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivos = Array.from(input.files ?? []);
    const disponibles = this.MAX_FOTOS - this.fotosCapturadas().length;
    archivos.slice(0, disponibles).forEach((archivo) => {
      if (!archivo.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fotosCapturadas.update(f => [...f, e.target?.result as string]);
      };
      reader.readAsDataURL(archivo);
    });
    input.value = '';
  }

  // ── Webcam ─────────────────────────────────────────────────────────────────

  protected async iniciarCamara(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = this.videoRef()?.nativeElement;
      if (video) {
        video.srcObject = this.stream;
        await video.play();
      }
      this.camaraActiva.set(true);
      this.error = null;
    } catch {
      this.error = 'No se pudo acceder a la cámara. Verifica los permisos del navegador.';
    }
  }

  protected detenerCamara(): void {
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
    this.camaraActiva.set(false);
  }

  protected capturarFoto(): void {
    if (this.fotosCapturadas().length >= this.MAX_FOTOS) return;

    const video = this.videoRef()?.nativeElement;
    const canvas = this.canvasRef()?.nativeElement;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    this.fotosCapturadas.update(fotos => [...fotos, dataUrl]);
  }

  protected eliminarFoto(index: number): void {
    this.fotosCapturadas.update(fotos => fotos.filter((_, i) => i !== index));
  }

  // ── Envío del formulario ───────────────────────────────────────────────────

  protected guardar(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    if (this.rolEsEstudiante() && this.fotosCapturadas().length === 0) {
      this.error = 'Debes capturar al menos una foto del rostro del estudiante.';
      return;
    }

    this.guardando = true;
    this.error = null;

    const { codigoRol, codigoCarrera, ...campos } = this.usuarioForm.getRawValue();

    this.usuarioService.crear({
      ...campos,
      codigoRol,
      codigoCarrera,
      fotoUsuario: '',
    }).subscribe({
      next: (usuario) => {
        if (this.rolEsEstudiante() && this.fotosCapturadas().length > 0) {
          this.subirRostros(usuario.codigoUsuario);
        } else {
          this.router.navigate(['/layout/usuarios']);
        }
      },
      error: () => {
        this.error = 'No se pudo crear el usuario.';
        this.guardando = false;
      },
    });
  }

  private subirRostros(codigoUsuario: number): void {
    const formData = new FormData();
    this.fotosCapturadas().forEach((dataUrl, i) => {
      formData.append('imagenes', this.dataUrlToBlob(dataUrl), `rostro_${i + 1}.jpg`);
    });

    this.usuarioService.subirRostros(codigoUsuario, formData).subscribe({
      next: (res) => {
        if (res.rostrosGuardados === 0) {
          // Se creó el usuario pero OpenCV no validó ningún rostro
          this.error = 'El usuario fue creado pero no se detectó ningún rostro válido en las fotos.';
          this.guardando = false;
        } else {
          this.router.navigate(['/layout/usuarios']);
        }
      },
      error: () => {
        // Usuario creado, fotos fallaron — igual navega
        this.router.navigate(['/layout/usuarios']);
      },
    });
  }

  private dataUrlToBlob(dataUrl: string): Blob {
    const [header, data] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)![1];
    const binary = atob(data);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return new Blob([buffer], { type: mime });
  }

  // ── Catálogos ──────────────────────────────────────────────────────────────

  private cargarCatalogos(): void {
    this.rolService.listar(0, 100).subscribe({
      next: (response) => this.roles.set(response.lista ?? []),
      error: () => (this.error = 'No se pudieron cargar los roles.'),
    });

    this.carreraService.listar(0, 100).subscribe({
      next: (response) => this.carreras.set(response.lista ?? []),
      error: () => (this.error = 'No se pudieron cargar las carreras.'),
    });
  }
}
