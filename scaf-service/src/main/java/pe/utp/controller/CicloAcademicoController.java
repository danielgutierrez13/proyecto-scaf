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
import pe.utp.dto.cicloAcademico.CicloAcademicoRequestDto;
import pe.utp.dto.cicloAcademico.CicloAcademicoResponseDto;
import pe.utp.service.CicloAcademicoService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cicloAcademico")
@CrossOrigin(origins = "http://localhost:4200")
public class CicloAcademicoController {

    private final CicloAcademicoService cicloAcademicoService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public PaginateResponseDto<CicloAcademicoResponseDto> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return cicloAcademicoService.listar(pageable);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CicloAcademicoResponseDto buscarPorId(
            @PathVariable Long id
    ) {
        return cicloAcademicoService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CicloAcademicoResponseDto crear(
            @Valid @RequestBody CicloAcademicoRequestDto cicloAcademicoRequestDto
    ){
        return cicloAcademicoService.crear(cicloAcademicoRequestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public CicloAcademicoResponseDto actualizar(
            @PathVariable Long id,
            @Valid @RequestBody CicloAcademicoRequestDto cicloAcademicoRequestDto
    ) {
        return cicloAcademicoService.actualizar(id, cicloAcademicoRequestDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(
            @PathVariable Long id
    ) {
        cicloAcademicoService.eliminar(id);
    }
}
