package pe.utp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.utp.repository.model.Rol;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {
}
