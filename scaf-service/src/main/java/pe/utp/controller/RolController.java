package pe.utp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.rol.RolRequestDto;
import pe.utp.dto.rol.RolResponseDto;
import pe.utp.service.RolService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/roles")
public class RolController {

    private final RolService rolService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public PaginateResponseDto<RolResponseDto> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return rolService.listar(pageable);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RolResponseDto buscarPorId(@PathVariable Long id) {
        return rolService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RolResponseDto crear(
            @Valid @RequestBody RolRequestDto rolRequestDto
    ) {
        return rolService.crear(rolRequestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RolResponseDto actualizar(
            @PathVariable Long id,
            @Valid @RequestBody RolRequestDto rolRequestDto
    ) {
        return rolService.actualizar(id, rolRequestDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        rolService.eliminar(id);
    }
}
