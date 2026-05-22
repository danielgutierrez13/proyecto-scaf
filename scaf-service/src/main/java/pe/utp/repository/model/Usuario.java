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
@Table(name = "usuarios")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codigousuario")
    private Long codigoUsusario;

    @Column(name = "nombres")
    private String nombres;

    @Column(name = "apellidos")
    private String apellidos;

    @Column(name = "codigouniversitario")
    private String codigoUniversitario;

    @Column(name = "correoinstitucional")
    private String correoInstitucional;

    @Column(name = "password")
    private String password;

    @Column(name = "telefono")
    private String telefono;

    @ManyToOne
    @JoinColumn(name = "codigorol", referencedColumnName = "codigorol")
    private Rol rol;

    @Column(name = "fotousuario")
    private String fotoUsuario;

    @ManyToOne
    @JoinColumn(name = "codigocarrera", referencedColumnName = "codigocarrera")
    private Carrera carrera;

    @Column(name = "estado")
    private Boolean estado;
}
