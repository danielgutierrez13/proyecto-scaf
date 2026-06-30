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
import pe.utp.dto.carrera.CarreraRequestDto;
import pe.utp.dto.carrera.CarreraResponseDto;
import pe.utp.service.CarreraService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/carreras")
public class CarreraController {

    private final CarreraService carreraService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public PaginateResponseDto<CarreraResponseDto> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return carreraService.listar(pageable);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CarreraResponseDto buscarPorId(@PathVariable Long id) {
        return carreraService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CarreraResponseDto crear(
            @Valid @RequestBody CarreraRequestDto carreraRequestDto) {
        return carreraService.crear(carreraRequestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CarreraResponseDto actualizar(
            @PathVariable Long id,
            @Valid @RequestBody CarreraRequestDto carreraRequestDto
    ) {
        return carreraService.actualizar(id, carreraRequestDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        carreraService.eliminar(id);
    }
}
