import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { UsuarioResponse } from '../../../../core/models/usuario.model';
import { UsuarioService } from '../../../usuario/service/usuario.service';

@Component({
  selector: 'app-estudiante-perfil',
  templateUrl: './estudiante-perfil.html',
  styleUrl: './estudiante-perfil.scss',
})
export class EstudiantePerfilComponent implements OnInit {
  private readonly auth           = inject(AuthService);
  private readonly usuarioService = inject(UsuarioService);

  protected readonly perfil   = signal<UsuarioResponse | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error    = signal<string | null>(null);

  ngOnInit(): void {
    const codigo = this.auth.usuario()?.codigoUsuario;
    if (!codigo) return;

    this.usuarioService.buscarPorId(codigo).subscribe({
      next:  (data) => { this.perfil.set(data); this.cargando.set(false); },
      error: ()     => { this.error.set('No se pudo cargar el perfil.'); this.cargando.set(false); },
    });
  }
}
