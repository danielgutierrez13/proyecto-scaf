package pe.utp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pe.utp.repository.model.CicloAcademico;

import java.util.Optional;

@Repository
public interface CicloAcademicoRepository extends JpaRepository<CicloAcademico, Long> {

    Optional<CicloAcademico> findFirstByVigenteTrue();

    @Modifying
    @Query("UPDATE CicloAcademico c SET c.vigente = false")
    void desactivarTodos();
}
