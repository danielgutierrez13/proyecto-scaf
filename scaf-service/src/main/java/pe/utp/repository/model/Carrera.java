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
@Table(name = "carrera")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Carrera {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codigocarrera")
    private Long codigoCarrera;

    @Column(name = "nombrecarrera")
    private String nombreCarrera;

    @Column(name = "descripcion")
    private String descripcion;
}
