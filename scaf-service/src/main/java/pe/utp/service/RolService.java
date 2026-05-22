package pe.utp.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pe.utp.repository.model.Rol;

public interface RolService {

    Page<Rol> listar(Pageable pageable);

    Optional<Rol> buscarPorId(Long id);

    Rol crear(Rol rol);

    Optional<Rol> actualizar(Long id, Rol rol);

    boolean eliminar(Long id);
}
