package pe.utp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.utp.repository.model.Asignacion;

import java.util.List;

@Repository
public interface AsignacionRepository extends JpaRepository<Asignacion, Long> {

    List<Asignacion> findByDocente_CodigoUsusarioAndCicloAcademico_VigenteTrue(Long codigoDocente);

    List<Asignacion> findByCicloAcademico_VigenteTrue();
}
