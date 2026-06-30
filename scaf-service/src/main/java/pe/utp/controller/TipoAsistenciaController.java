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
import pe.utp.dto.tipoAsistencia.TipoAsistenciaRequestDto;
import pe.utp.dto.tipoAsistencia.TipoAsistenciaResponseDto;
import pe.utp.service.TipoAsistenciaService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tipos-asistencia")
public class TipoAsistenciaController {

    private final TipoAsistenciaService tipoAsistenciaService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public PaginateResponseDto<TipoAsistenciaResponseDto> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return tipoAsistenciaService.listar(pageable);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TipoAsistenciaResponseDto buscarPorId(@PathVariable Long id) {
        return tipoAsistenciaService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TipoAsistenciaResponseDto crear(@Valid @RequestBody TipoAsistenciaRequestDto tipoAsistenciaRequestDto) {
        return tipoAsistenciaService.crear(tipoAsistenciaRequestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public TipoAsistenciaResponseDto actualizar(
            @PathVariable Long id,
            @Valid @RequestBody TipoAsistenciaRequestDto tipoAsistenciaRequestDto
    ) {
        return tipoAsistenciaService.actualizar(id, tipoAsistenciaRequestDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        tipoAsistenciaService.eliminar(id);
    }
}
