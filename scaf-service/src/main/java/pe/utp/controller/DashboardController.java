package pe.utp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utp.dto.dashboard.DashboardDto;
import pe.utp.repository.AsignacionRepository;
import pe.utp.repository.CicloAcademicoRepository;
import pe.utp.repository.CursoRepository;
import pe.utp.repository.UsuarioRepository;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UsuarioRepository     usuarioRepository;
    private final AsignacionRepository  asignacionRepository;
    private final CursoRepository       cursoRepository;
    private final CicloAcademicoRepository cicloAcademicoRepository;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public DashboardDto estadisticas() {
        long estudiantes        = usuarioRepository.countByRol_NombreRolIgnoreCase("Estudiante");
        long docentes           = usuarioRepository.countByRol_NombreRolIgnoreCase("Docente");
        long cursos             = cursoRepository.count();
        long asignacionesVig    = asignacionRepository.findByCicloAcademico_VigenteTrue().size();
        String ciclo            = cicloAcademicoRepository.findFirstByVigenteTrue()
                                    .map(c -> c.getDescripcion())
                                    .orElse("Sin ciclo vigente");

        return new DashboardDto(estudiantes, docentes, cursos, asignacionesVig, ciclo);
    }
}
