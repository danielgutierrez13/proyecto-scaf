package pe.utp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.utp.repository.model.Asistencia;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    List<Asistencia> findByUsuario_CodigoUsusario(Long codigoEstudiante);

    boolean existsByUsuario_CodigoUsusarioAndAsignacion_CodigoAsignacionAndFecha(
            Long codigoEstudiante, Long codigoAsignacion, LocalDate fecha);

    List<Asistencia> findByAsignacion_CodigoAsignacionAndFecha(
            Long codigoAsignacion, LocalDate fecha);

    List<Asistencia> findByAsignacion_CodigoAsignacion(Long codigoAsignacion);

    long countByUsuario_CodigoUsusarioAndAsignacion_CodigoAsignacion(
            Long codigoEstudiante, Long codigoAsignacion);
}
