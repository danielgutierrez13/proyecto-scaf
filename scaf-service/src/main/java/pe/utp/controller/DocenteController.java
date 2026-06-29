package pe.utp.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utp.dto.asignacion.AsignacionResponseDto;
import pe.utp.repository.AsignacionRepository;
import pe.utp.service.mapper.AsignacionMapper;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/docente")
public class DocenteController {

    private final AsignacionRepository asignacionRepository;
    private final AsignacionMapper asignacionMapper;

    /** Cursos que dicta el docente en el ciclo vigente. */
    @GetMapping("/{codigoDocente}/cursos")
    @ResponseStatus(HttpStatus.OK)
    public List<AsignacionResponseDto> misCursos(@PathVariable Long codigoDocente) {
        return asignacionRepository
                .findByDocente_CodigoUsusarioAndCicloAcademico_VigenteTrue(codigoDocente)
                .stream()
                .map(asignacionMapper::toResponseDto)
                .toList();
    }
}
