package pe.utp.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.asignacion.AsignacionRequestDto;
import pe.utp.dto.asignacion.AsignacionResponseDto;
import pe.utp.repository.AsignacionRepository;
import pe.utp.repository.CicloAcademicoRepository;
import pe.utp.repository.CursoRepository;
import pe.utp.repository.HorarioRepository;
import pe.utp.repository.UsuarioRepository;
import pe.utp.repository.model.Asignacion;
import pe.utp.repository.model.CicloAcademico;
import pe.utp.repository.model.Curso;
import pe.utp.repository.model.Horario;
import pe.utp.repository.model.Usuario;
import pe.utp.service.AsignacionService;
import pe.utp.service.exception.CodigoError;
import pe.utp.service.exception.ScafException;
import pe.utp.service.mapper.AsignacionMapper;

@Service
@RequiredArgsConstructor
public class AsignacionServiceImpl implements AsignacionService {

    private final AsignacionRepository asignacionRepository;
    private final UsuarioRepository usuarioRepository;
    private final CursoRepository cursoRepository;
    private final HorarioRepository horarioRepository;
    private final CicloAcademicoRepository cicloAcademicoRepository;
    private final AsignacionMapper asignacionMapper;

    @Override
    public PaginateResponseDto<AsignacionResponseDto> listar(Pageable pageable) {
        Page<AsignacionResponseDto> pagina = asignacionRepository.findAll(pageable)
                .map(asignacionMapper::toResponseDto);

        return new PaginateResponseDto<>(pagina.getContent(), pagina.getTotalElements(), pagina.getTotalPages(), pagina.getNumber());
    }

    @Override
    public AsignacionResponseDto buscarPorId(Long id) {
        return asignacionRepository.findById(id)
                .map(asignacionMapper::toResponseDto)
                .orElseThrow(() -> ScafException.of(CodigoError.ASIGNACION_NO_ENCONTRADA));
    }

    @Override
    public AsignacionResponseDto crear(AsignacionRequestDto asignacionRequestDto) {
        Asignacion asignacion = new Asignacion();
        actualizarDatos(asignacion, asignacionRequestDto);
        return asignacionMapper.toResponseDto(asignacionRepository.save(asignacion));
    }

    @Override
    public AsignacionResponseDto actualizar(Long id, AsignacionRequestDto asignacionRequestDto) {
        Asignacion asignacionExistente = asignacionRepository.findById(id)
                .orElseThrow(() -> ScafException.of(CodigoError.ASIGNACION_NO_ENCONTRADA));
        actualizarDatos(asignacionExistente, asignacionRequestDto);
        return asignacionMapper.toResponseDto(asignacionRepository.save(asignacionExistente));
    }

    @Override
    public void eliminar(Long id) {
        if (!asignacionRepository.existsById(id)) {
            throw ScafException.of(CodigoError.ASIGNACION_NO_ENCONTRADA);
        }
        asignacionRepository.deleteById(id);
    }

    private void actualizarDatos(Asignacion asignacion, AsignacionRequestDto requestDto) {
        Usuario docente = buscarDocente(requestDto.getCodigoDocente());
        Curso curso = buscarCurso(requestDto.getCodigoCurso());
        Horario horario = buscarHorario(requestDto.getCodigoHorario());
        CicloAcademico cicloAcademico = buscarCicloAcademico(requestDto.getCodigoCicloAcademico());
        asignacionMapper.actualizarEntidad(asignacion, docente, curso, horario, cicloAcademico);
    }

    private Usuario buscarDocente(Long codigoDocente) {
        if (codigoDocente == null) {
            return null;
        }
        return usuarioRepository.findById(codigoDocente)
                .orElseThrow(() -> ScafException.of(CodigoError.ASIGNACION_DOCENTE_NO_ENCONTRADO));
    }

    private Curso buscarCurso(Long codigoCurso) {
        if (codigoCurso == null) {
            return null;
        }
        return cursoRepository.findById(codigoCurso)
                .orElseThrow(() -> ScafException.of(CodigoError.ASIGNACION_CURSO_NO_ENCONTRADO));
    }

    private Horario buscarHorario(Long codigoHorario) {
        if (codigoHorario == null) {
            return null;
        }
        return horarioRepository.findById(codigoHorario)
                .orElseThrow(() -> ScafException.of(CodigoError.ASIGNACION_HORARIO_NO_ENCONTRADO));
    }

    private CicloAcademico buscarCicloAcademico(Long codigoCicloAcademico) {
        if (codigoCicloAcademico == null) {
            return null;
        }
        return cicloAcademicoRepository.findById(codigoCicloAcademico)
                .orElseThrow(() -> ScafException.of(CodigoError.ASIGNACION_CICLO_ACADEMICO_NO_ENCONTRADO));
    }
}
