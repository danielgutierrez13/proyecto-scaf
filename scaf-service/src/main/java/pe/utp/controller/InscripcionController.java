package pe.utp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.inscripcion.InscripcionRequestDto;
import pe.utp.dto.inscripcion.InscripcionResponseDto;
import pe.utp.service.InscripcionService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inscripciones")
public class InscripcionController {

    private final InscripcionService inscripcionService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public PaginateResponseDto<InscripcionResponseDto> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return inscripcionService.listar(pageable);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public InscripcionResponseDto buscarPorId(@PathVariable Long id) {
        return inscripcionService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InscripcionResponseDto crear(@Valid @RequestBody InscripcionRequestDto inscripcionRequestDto) {
        return inscripcionService.crear(inscripcionRequestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public InscripcionResponseDto actualizar(
            @PathVariable Long id,
            @Valid @RequestBody InscripcionRequestDto inscripcionRequestDto
    ) {
        return inscripcionService.actualizar(id, inscripcionRequestDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        inscripcionService.eliminar(id);
    }
}
