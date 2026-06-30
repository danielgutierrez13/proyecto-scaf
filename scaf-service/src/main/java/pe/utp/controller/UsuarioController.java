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
import org.springframework.web.multipart.MultipartFile;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.usuario.UsuarioRequestDto;
import pe.utp.dto.usuario.UsuarioResponseDto;
import pe.utp.service.RostroService;
import pe.utp.service.UsuarioService;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final RostroService rostroService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public PaginateResponseDto<UsuarioResponseDto> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String nombreRol
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return usuarioService.listar(pageable, nombreRol);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UsuarioResponseDto buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponseDto crear(
            @Valid @RequestBody UsuarioRequestDto usuarioRequestDto
    ) {
        return usuarioService.crear(usuarioRequestDto);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UsuarioResponseDto actualizar(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioRequestDto usuarioRequestDto
    ) {
        return usuarioService.actualizar(id, usuarioRequestDto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
    }

    /**
     * Recibe imÃ¡genes del rostro del estudiante, valida con OpenCV que
     * contengan un rostro y las guarda en el file server.
     */
    @PostMapping("/{id}/rostros")
    @ResponseStatus(HttpStatus.OK)
    public Map<String, Integer> subirRostros(
            @PathVariable Long id,
            @RequestParam("imagenes") List<MultipartFile> imagenes
    ) throws IOException {
        int guardados = rostroService.guardarRostros(id, imagenes);
        return Map.of("rostrosGuardados", guardados);
    }
}