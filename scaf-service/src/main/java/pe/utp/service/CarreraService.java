package pe.utp.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pe.utp.repository.model.Carrera;

public interface CarreraService {

    Page<Carrera> listar(Pageable pageable);

    Optional<Carrera> buscarPorId(Long id);

    Carrera crear(Carrera carrera);

    Optional<Carrera> actualizar(Long id, Carrera carrera);

    boolean eliminar(Long id);
}
