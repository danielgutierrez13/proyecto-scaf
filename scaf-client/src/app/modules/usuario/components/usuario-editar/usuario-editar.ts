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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { CarreraResponse } from '../../../../core/models/carrera.model';
import { RolResponse } from '../../../../core/models/rol.model';
import { CarreraService } from '../../../carrera/service/carrera.service';
import { RolService } from '../../../rol/service/rol.service';
import { UsuarioService } from '../../service/usuario.service';

@Component({
  selector: 'app-usuario-editar',
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
  templateUrl: './usuario-editar.html',
  styleUrl: './usuario-editar.scss',
})
export class UsuarioEditarComponent implements OnInit {
  private readonly fb             = inject(FormBuilder);
  private readonly route          = inject(ActivatedRoute);
  private readonly router         = inject(Router);
  private readonly destroyRef     = inject(DestroyRef);
  private readonly usuarioService = inject(UsuarioService);
  private readonly rolService     = inject(RolService);
  private readonly carreraService = inject(CarreraService);

  private readonly videoRef     = viewChild<ElementRef<HTMLVideoElement>>('videoElement');
  private readonly canvasRef    = viewChild<ElementRef<HTMLCanvasElement>>('canvasElement');
  private readonly archivoInput = viewChild<ElementRef<HTMLInputElement>>('archivoInput');

  protected readonly roles    = signal<RolResponse[]>([]);
  protected readonly carreras = signal<CarreraResponse[]>([]);

  protected readonly codigoRolSeleccionado = signal<number | null>(null);
  protected readonly rolEsEstudiante = computed(() => {
    const codigoRol = this.codigoRolSeleccionado();
    const lista = this.roles();
    if (!codigoRol || !lista.length) return false;
    const rol = lista.find(r => r.codigoRol === codigoRol);
    return rol?.nombreRol?.toLowerCase().includes('estudiante') ?? false;
  });

  protected readonly usuarioForm = this.fb.nonNullable.group({
    nombres:              ['', [Validators.required, Validators.maxLength(120)]],
    apellidos:            ['', [Validators.required, Validators.maxLength(120)]],
    codigoUniversitario:  ['', [Validators.required, Validators.maxLength(30)]],
    correoInstitucional:  ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    password:             ['', [Validators.minLength(6), Validators.maxLength(80)]],
    telefono:             ['', [Validators.required, Validators.maxLength(20)]],
    codigoRol:            this.fb.control<number | null>(null, Validators.required),
    fotoUsuario:          ['', Validators.maxLength(255)],
    codigoCarrera:        this.fb.control<number | null>(null, Validators.required),
    estado:               [true],
  });

  protected readonly cargando  = signal(true);
  protected readonly guardando = signal(false);
  protected readonly error     = signal<string | null>(null);
  protected usuarioId: number | null = null;

  // — Fotos de rostro —
  protected readonly modoRostro     = signal<'camara' | 'subir'>('camara');
  protected readonly camaraActiva   = signal(false);
  protected readonly fotosCapturadas = signal<string[]>([]);
  protected readonly MAX_FOTOS = 10;
  private stream: MediaStream | null = null;

  ngOnInit(): void {
    this.cargarCatalogos();

    this.usuarioForm.controls.codigoRol.valueChanges.subscribe(val => {
      this.codigoRolSeleccionado.set(val);
      if (!this.rolEsEstudiante()) {
        this.detenerCamara();
        this.fotosCapturadas.set([]);
      }
    });

    this.destroyRef.onDestroy(() => this.detenerCamara());

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (!Number.isFinite(id) || id <= 0) {
        this.error.set('El identificador de usuario no es valido.');
        this.cargando.set(false);
        return;
      }
      this.usuarioId = id;
      this.cargarUsuario(id);
    });
  }

  // ── Modo rostro ────────────────────────────────────────────────────────────

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

  protected async iniciarCamara(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.camaraActiva.set(true);
      setTimeout(() => {
        const video = this.videoRef()?.nativeElement;
        if (video && this.stream) { video.srcObject = this.stream; video.play().catch(() => {}); }
      }, 0);
    } catch {
      this.error.set('No se pudo acceder a la cámara. Verifica los permisos del navegador.');
    }
  }

  protected detenerCamara(): void {
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
    this.camaraActiva.set(false);
  }

  protected capturarFoto(): void {
    if (this.fotosCapturadas().length >= this.MAX_FOTOS) return;
    const video  = this.videoRef()?.nativeElement;
    const canvas = this.canvasRef()?.nativeElement;
    if (!video || !canvas) return;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);
    this.fotosCapturadas.update(f => [...f, canvas.toDataURL('image/jpeg', 0.92)]);
  }

  protected eliminarFoto(index: number): void {
    this.fotosCapturadas.update(f => f.filter((_, i) => i !== index));
  }

  // ── Guardar ────────────────────────────────────────────────────────────────

  protected guardar(): void {
    if (!this.usuarioId || this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    this.usuarioService.actualizar(this.usuarioId, this.usuarioForm.getRawValue()).subscribe({
      next: () => {
        if (this.rolEsEstudiante() && this.fotosCapturadas().length > 0) {
          this.subirRostros(this.usuarioId!);
        } else {
          this.router.navigate(['/layout/usuarios']);
        }
      },
      error: () => {
        this.error.set('No se pudo actualizar el usuario.');
        this.guardando.set(false);
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
          this.error.set('El usuario fue actualizado pero no se detectó ningún rostro válido en las fotos.');
          this.guardando.set(false);
        } else {
          this.router.navigate(['/layout/usuarios']);
        }
      },
      error: () => this.router.navigate(['/layout/usuarios']),
    });
  }

  private dataUrlToBlob(dataUrl: string): Blob {
    const [header, data] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)![1];
    const binary = atob(data);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);
    return new Blob([buffer], { type: mime });
  }

  // ── Catálogos ──────────────────────────────────────────────────────────────

  private cargarUsuario(id: number): void {
    this.cargando.set(true);
    this.error.set(null);

    this.usuarioService.buscarPorId(id).pipe(finalize(() => this.cargando.set(false))).subscribe({
      next: (usuario) => {
        this.usuarioForm.patchValue({
          nombres:             usuario.nombres ?? '',
          apellidos:           usuario.apellidos ?? '',
          codigoUniversitario: usuario.codigoUniversitario ?? '',
          correoInstitucional: usuario.correoInstitucional ?? '',
          password:            '',
          telefono:            usuario.telefono ?? '',
          codigoRol:           usuario.codigoRol ? Number(usuario.codigoRol) : null,
          fotoUsuario:         usuario.fotoUsuario ?? '',
          codigoCarrera:       usuario.codigoCarrera ? Number(usuario.codigoCarrera) : null,
          estado:              Boolean(usuario.estado),
        });
        this.codigoRolSeleccionado.set(usuario.codigoRol ? Number(usuario.codigoRol) : null);
      },
      error: () => this.error.set('No se pudo encontrar el usuario solicitado.'),
    });
  }

  private cargarCatalogos(): void {
    this.rolService.listar(0, 100).subscribe({
      next: (response) => this.roles.set(response.lista ?? []),
      error: () => this.error.set('No se pudieron cargar los roles.'),
    });
    this.carreraService.listar(0, 100).subscribe({
      next: (response) => this.carreras.set(response.lista ?? []),
      error: () => this.error.set('No se pudieron cargar las carreras.'),
    });
  }
}
