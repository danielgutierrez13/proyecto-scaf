package pe.utp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.utp.repository.model.TipoAsistencia;

@Repository
public interface TipoAsistenciaRepository extends JpaRepository<TipoAsistencia, Long> {
}
