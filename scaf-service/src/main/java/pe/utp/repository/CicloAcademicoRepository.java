package pe.utp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.utp.repository.model.CicloAcademico;

@Repository
public interface CicloAcademicoRepository extends JpaRepository<CicloAcademico, Long> {
}
