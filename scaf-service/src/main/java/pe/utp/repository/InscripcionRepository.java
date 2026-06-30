package pe.utp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.utp.repository.model.Inscripcion;

import java.util.List;

@Repository
public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {

    List<Inscripcion> findByEstudiante_CodigoUsusario(Long codigoEstudiante);

    List<Inscripcion> findByEstudiante_CodigoUsusarioAndAsignacion_CicloAcademico_VigenteTrue(Long codigoEstudiante);

    List<Inscripcion> findByAsignacion_CodigoAsignacion(Long codigoAsignacion);

    boolean existsByEstudiante_CodigoUsusarioAndAsignacion_CodigoAsignacion(Long codigoEstudiante, Long codigoAsignacion);
}
