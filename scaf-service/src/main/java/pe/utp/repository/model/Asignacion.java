package pe.utp.repository.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "asignacion")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Asignacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codigoasignacion")
    private Long codigoAsignacion;

    @ManyToOne
    @JoinColumn(name = "codigodocente", referencedColumnName = "codigousuario")
    private Usuario docente;

    @ManyToOne
    @JoinColumn(name = "codigocurso", referencedColumnName = "codigocurso")
    private Curso curso;

    @ManyToOne
    @JoinColumn(name = "codigohorario", referencedColumnName = "codigohorario")
    private Horario horario;

    @ManyToOne
    @JoinColumn(name = "codigocicloacademico", referencedColumnName = "codigocicloacademico")
    private CicloAcademico cicloAcademico;
}
