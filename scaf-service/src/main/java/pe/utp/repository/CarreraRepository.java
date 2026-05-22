package pe.utp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.utp.repository.model.Carrera;

@Repository
public interface CarreraRepository extends JpaRepository<Carrera, Long> {
}
