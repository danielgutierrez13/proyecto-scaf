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
@Table(name = "horario")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codigohorario")
    private Long codigoHorario;

    @Column(name = "dia")
    private String dia;

    @Column(name = "horainicio")
    private String horaInicio;

    @Column(name = "horafin")
    private String horaFin;

    @Column(name = "aula")
    private String aula;
}
