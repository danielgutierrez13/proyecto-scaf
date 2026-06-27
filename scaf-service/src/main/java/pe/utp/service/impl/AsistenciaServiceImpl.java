package pe.utp.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.asistencia.AsistenciaRequestDto;
import pe.utp.dto.asistencia.AsistenciaResponseDto;
import pe.utp.repository.AsignacionRepository;
import pe.utp.repository.AsistenciaRepository;
import pe.utp.repository.TipoAsistenciaRepository;
import pe.utp.repository.UsuarioRepository;
import pe.utp.repository.model.Asignacion;
import pe.utp.repository.model.Asistencia;
import pe.utp.repository.model.TipoAsistencia;
import pe.utp.repository.model.Usuario;
import pe.utp.service.AsistenciaService;
import pe.utp.service.exception.CodigoError;
import pe.utp.service.exception.ScafException;
import pe.utp.service.mapper.AsistenciaMapper;

@Service
@RequiredArgsConstructor
public class AsistenciaServiceImpl implements AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;
    private final UsuarioRepository usuarioRepository;
    private final AsignacionRepository asignacionRepository;
    private final TipoAsistenciaRepository tipoAsistenciaRepository;
    private final AsistenciaMapper asistenciaMapper;

    @Override
    public PaginateResponseDto<AsistenciaResponseDto> listar(Pageable pageable) {
        Page<AsistenciaResponseDto> pagina = asistenciaRepository.findAll(pageable)
                .map(asistenciaMapper::toResponseDto);

        return new PaginateResponseDto<>(pagina.getContent(), pagina.getTotalElements(), pagina.getTotalPages(), pagina.getNumber());
    }

    @Override
    public AsistenciaResponseDto buscarPorId(Long id) {
        return asistenciaRepository.findById(id)
                .map(asistenciaMapper::toResponseDto)
                .orElseThrow(() -> ScafException.of(CodigoError.ASISTENCIA_NO_ENCONTRADA));
    }

    @Override
    public AsistenciaResponseDto crear(AsistenciaRequestDto asistenciaRequestDto) {
        Asistencia asistencia = new Asistencia();
        actualizarDatos(asistencia, asistenciaRequestDto);
        return asistenciaMapper.toResponseDto(asistenciaRepository.save(asistencia));
    }

    @Override
    public AsistenciaResponseDto actualizar(Long id, AsistenciaRequestDto asistenciaRequestDto) {
        Asistencia asistenciaExistente = asistenciaRepository.findById(id)
                .orElseThrow(() -> ScafException.of(CodigoError.ASISTENCIA_NO_ENCONTRADA));
        actualizarDatos(asistenciaExistente, asistenciaRequestDto);
        return asistenciaMapper.toResponseDto(asistenciaRepository.save(asistenciaExistente));
    }

    @Override
    public void eliminar(Long id) {
        if (!asistenciaRepository.existsById(id)) {
            throw ScafException.of(CodigoError.ASISTENCIA_NO_ENCONTRADA);
        }
        asistenciaRepository.deleteById(id);
    }

    private void actualizarDatos(Asistencia asistencia, AsistenciaRequestDto requestDto) {
        Usuario usuario = buscarUsuario(requestDto.getCodigoUsuario());
        Asignacion asignacion = buscarAsignacion(requestDto.getCodigoAsignacion());
        TipoAsistencia tipoAsistencia = buscarTipoAsistencia(requestDto.getCodigoTipoAsistencia());
        asistenciaMapper.actualizarEntidad(asistencia, requestDto, usuario, asignacion, tipoAsistencia);
    }

    private Usuario buscarUsuario(Long codigoUsuario) {
        if (codigoUsuario == null) {
            return null;
        }
        return usuarioRepository.findById(codigoUsuario)
                .orElseThrow(() -> ScafException.of(CodigoError.ASISTENCIA_USUARIO_NO_ENCONTRADO));
    }

    private Asignacion buscarAsignacion(Long codigoAsignacion) {
        if (codigoAsignacion == null) {
            return null;
        }
        return asignacionRepository.findById(codigoAsignacion)
                .orElseThrow(() -> ScafException.of(CodigoError.ASISTENCIA_ASIGNACION_NO_ENCONTRADA));
    }

    private TipoAsistencia buscarTipoAsistencia(Long codigoTipoAsistencia) {
        if (codigoTipoAsistencia == null) {
            return null;
        }
        return tipoAsistenciaRepository.findById(codigoTipoAsistencia)
                .orElseThrow(() -> ScafException.of(CodigoError.ASISTENCIA_TIPO_ASISTENCIA_NO_ENCONTRADO));
    }
}
