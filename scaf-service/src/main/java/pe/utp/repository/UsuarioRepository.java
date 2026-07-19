package pe.utp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.utp.repository.model.Usuario;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Page<Usuario> findByRol_NombreRolIgnoreCase(String nombreRol, Pageable pageable);

    long countByRol_NombreRolIgnoreCase(String nombreRol);

    Optional<Usuario> findByCodigoUniversitario(String codigoUniversitario);
}
