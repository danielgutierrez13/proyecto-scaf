package pe.utp.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pe.utp.repository.UsuarioRepository;
import pe.utp.repository.model.Usuario;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String codigoUniversitario) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository
                .findByCodigoUniversitario(codigoUniversitario)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado: " + codigoUniversitario));

        String rol = usuario.getRol() != null
                ? usuario.getRol().getNombreRol().toUpperCase()
                : "SIN_ROL";

        return User.builder()
                .username(codigoUniversitario)
                .password(usuario.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + rol)))
                .accountLocked(Boolean.FALSE.equals(usuario.getEstado()))
                .build();
    }
}
