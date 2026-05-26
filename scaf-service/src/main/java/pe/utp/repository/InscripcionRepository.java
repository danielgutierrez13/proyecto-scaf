package pe.utp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.utp.repository.model.Inscripcion;

@Repository
public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {
}
