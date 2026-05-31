package pe.utp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.utp.repository.model.Curso;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {
}
