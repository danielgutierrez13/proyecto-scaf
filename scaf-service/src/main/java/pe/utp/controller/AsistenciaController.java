package pe.utp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import pe.utp.dto.asistencia.AsistenciaRequestDto;
import pe.utp.dto.asistencia.AsistenciaResponseDto;
import pe.utp.service.AsistenciaService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/asistencias")
@CrossOrigin(origins = "http://localhost:4200")
public class AsistenciaController {

    private final AsistenciaService asistenciaService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public PaginateResponseDto<AsistenciaResponseDto> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return asistenciaService.listar(pageable);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public AsistenciaResponseDto buscarPorId(@PathVariable Long id) {
        return asistenciaService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AsistenciaResponseDto crear(@Valid @RequestBody AsistenciaRequestDto asistenciaRequestDto) {
        return asistenciaService.crear(asistenciaRequestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public AsistenciaResponseDto actualizar(
            @PathVariable Long id,
            @Valid @RequestBody AsistenciaRequestDto asistenciaRequestDto
    ) {
        return asistenciaService.actualizar(id, asistenciaRequestDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        asistenciaService.eliminar(id);
    }
}
