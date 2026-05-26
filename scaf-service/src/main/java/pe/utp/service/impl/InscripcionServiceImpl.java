package pe.utp.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.inscripcion.InscripcionRequestDto;
import pe.utp.dto.inscripcion.InscripcionResponseDto;
import pe.utp.repository.AsignacionRepository;
import pe.utp.repository.InscripcionRepository;
import pe.utp.repository.UsuarioRepository;
import pe.utp.repository.model.Asignacion;
import pe.utp.repository.model.Inscripcion;
import pe.utp.repository.model.Usuario;
import pe.utp.service.InscripcionService;
import pe.utp.service.exception.CodigoError;
import pe.utp.service.exception.ScafException;
import pe.utp.service.mapper.InscripcionMapper;

@Service
@RequiredArgsConstructor
public class InscripcionServiceImpl implements InscripcionService {

    private final InscripcionRepository inscripcionRepository;
    private final UsuarioRepository usuarioRepository;
    private final AsignacionRepository asignacionRepository;
    private final InscripcionMapper inscripcionMapper;

    @Override
    public PaginateResponseDto<InscripcionResponseDto> listar(Pageable pageable) {
        Page<InscripcionResponseDto> pagina = inscripcionRepository.findAll(pageable)
                .map(inscripcionMapper::toResponseDto);

        return new PaginateResponseDto<>(pagina.getContent(), pagina.getTotalElements(), pagina.getTotalPages(), pagina.getNumber());
    }

    @Override
    public InscripcionResponseDto buscarPorId(Long id) {
        return inscripcionRepository.findById(id)
                .map(inscripcionMapper::toResponseDto)
                .orElseThrow(() -> ScafException.of(CodigoError.INSCRIPCION_NO_ENCONTRADA));
    }

    @Override
    public InscripcionResponseDto crear(InscripcionRequestDto inscripcionRequestDto) {
        Inscripcion inscripcion = new Inscripcion();
        actualizarDatos(inscripcion, inscripcionRequestDto);
        return inscripcionMapper.toResponseDto(inscripcionRepository.save(inscripcion));
    }

    @Override
    public InscripcionResponseDto actualizar(Long id, InscripcionRequestDto inscripcionRequestDto) {
        Inscripcion inscripcionExistente = inscripcionRepository.findById(id)
                .orElseThrow(() -> ScafException.of(CodigoError.INSCRIPCION_NO_ENCONTRADA));
        actualizarDatos(inscripcionExistente, inscripcionRequestDto);
        return inscripcionMapper.toResponseDto(inscripcionRepository.save(inscripcionExistente));
    }

    @Override
    public void eliminar(Long id) {
        if (!inscripcionRepository.existsById(id)) {
            throw ScafException.of(CodigoError.INSCRIPCION_NO_ENCONTRADA);
        }
        inscripcionRepository.deleteById(id);
    }

    private void actualizarDatos(Inscripcion inscripcion, InscripcionRequestDto requestDto) {
        Usuario estudiante = buscarEstudiante(requestDto.getCodigoEstudiante());
        Asignacion asignacion = buscarAsignacion(requestDto.getCodigoAsignacion());
        inscripcionMapper.actualizarEntidad(inscripcion, estudiante, asignacion);
    }

    private Usuario buscarEstudiante(Long codigoEstudiante) {
        if (codigoEstudiante == null) {
            return null;
        }
        return usuarioRepository.findById(codigoEstudiante)
                .orElseThrow(() -> ScafException.of(CodigoError.INSCRIPCION_ESTUDIANTE_NO_ENCONTRADO));
    }

    private Asignacion buscarAsignacion(Long codigoAsignacion) {
        if (codigoAsignacion == null) {
            return null;
        }
        return asignacionRepository.findById(codigoAsignacion)
                .orElseThrow(() -> ScafException.of(CodigoError.INSCRIPCION_ASIGNACION_NO_ENCONTRADA));
    }
}
