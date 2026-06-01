package pe.utp.repository.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "asistencia")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codigoasistencia")
    private Long codigoAsistencia;

    @ManyToOne
    @JoinColumn(name = "codigousuario", referencedColumnName = "codigousuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "codigoasignacion", referencedColumnName = "codigoasignacion")
    private Asignacion asignacion;

    @Column(name = "fecha")
    private LocalDate fecha;

    @Column(name = "horaingreso")
    private String horaIngreso;

    @Column(name = "estado")
    private Boolean estado;

    @ManyToOne
    @JoinColumn(name = "codigotipoasistencia", referencedColumnName = "codigotipoasistencia")
    private TipoAsistencia tipoAsistencia;
}
