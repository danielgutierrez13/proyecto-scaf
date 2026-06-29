package pe.utp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import pe.utp.dto.auth.LoginRequestDto;
import pe.utp.dto.auth.LoginResponseDto;
import pe.utp.repository.UsuarioRepository;
import pe.utp.repository.model.Usuario;
import pe.utp.security.JwtUtils;
import pe.utp.service.exception.CodigoError;
import pe.utp.service.exception.ScafException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponseDto login(@RequestBody LoginRequestDto request) {

        try {
            authenticationManager.authenticate (
                    new UsernamePasswordAuthenticationToken(
                            request.getCodigoUniversitario(),
                            request.getPassword()));
        } catch (BadCredentialsException | DisabledException | LockedException e) {
            throw ScafException.of(CodigoError.USUARIO_NO_ENCONTRADO);
        }

        Usuario usuario = usuarioRepository
                .findByCodigoUniversitario(request.getCodigoUniversitario())
                .orElseThrow(() -> ScafException.of(CodigoError.USUARIO_NO_ENCONTRADO));

        String rol = usuario.getRol() != null ? usuario.getRol().getNombreRol() : "";
        String token = jwtUtils.generarToken(usuario.getCodigoUniversitario(), rol);

        return LoginResponseDto.builder()
                .codigoUsuario(usuario.getCodigoUsusario())
                .nombres(usuario.getNombres())
                .apellidos(usuario.getApellidos())
                .correoInstitucional(usuario.getCorreoInstitucional())
                .codigoUniversitario(usuario.getCodigoUniversitario())
                .nombreRol(rol)
                .fotoUsuario(usuario.getFotoUsuario())
                .token(token)
                .build();
    }
}
