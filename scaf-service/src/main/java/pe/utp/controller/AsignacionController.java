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
import pe.utp.dto.asignacion.AsignacionRequestDto;
import pe.utp.dto.asignacion.AsignacionResponseDto;
import pe.utp.service.AsignacionService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/asignaciones")
public class AsignacionController {

    private final AsignacionService asignacionService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public PaginateResponseDto<AsignacionResponseDto> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return asignacionService.listar(pageable);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public AsignacionResponseDto buscarPorId(@PathVariable Long id) {
        return asignacionService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AsignacionResponseDto crear(@Valid @RequestBody AsignacionRequestDto asignacionRequestDto) {
        return asignacionService.crear(asignacionRequestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public AsignacionResponseDto actualizar(
            @PathVariable Long id,
            @Valid @RequestBody AsignacionRequestDto asignacionRequestDto
    ) {
        return asignacionService.actualizar(id, asignacionRequestDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        asignacionService.eliminar(id);
    }
}
