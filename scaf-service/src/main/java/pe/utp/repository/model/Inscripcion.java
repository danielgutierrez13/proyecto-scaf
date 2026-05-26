package pe.utp.repository.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "inscripcion")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codigoinscripcion")
    private Long codigoInscripcion;

    @ManyToOne
    @JoinColumn(name = "codigoestudiante", referencedColumnName = "codigousuario")
    private Usuario estudiante;

    @ManyToOne
    @JoinColumn(name = "codigoasignacion", referencedColumnName = "codigoasignacion")
    private Asignacion asignacion;
}
