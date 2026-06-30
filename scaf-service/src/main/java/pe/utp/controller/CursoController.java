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
import pe.utp.dto.curso.CursoRequestDto;
import pe.utp.dto.curso.CursoResponseDto;
import pe.utp.service.CursoService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cursos")
public class CursoController {

    private final CursoService cursoService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public PaginateResponseDto<CursoResponseDto> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return cursoService.listar(pageable);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CursoResponseDto buscarPorId(@PathVariable Long id) {
        return cursoService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CursoResponseDto crear(@Valid @RequestBody CursoRequestDto cursoRequestDto) {
        return cursoService.crear(cursoRequestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CursoResponseDto actualizar(@PathVariable Long id, @Valid @RequestBody CursoRequestDto cursoRequestDto) {
        return cursoService.actualizar(id, cursoRequestDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        cursoService.eliminar(id);
    }
}
