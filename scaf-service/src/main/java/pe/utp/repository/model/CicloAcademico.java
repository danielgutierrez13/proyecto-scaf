package pe.utp.repository.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cicloacademico")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CicloAcademico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codigocicloacademico")
    private Long codigoCicloAcademico;

    @Column(name = "anio")
    private int anio;

    @Column(name = "semestre")
    private int semestre;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "vigente")
    private Boolean vigente = false;
}
