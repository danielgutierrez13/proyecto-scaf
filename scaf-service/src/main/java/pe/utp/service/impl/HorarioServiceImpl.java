package pe.utp.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.horario.HorarioRequestDto;
import pe.utp.dto.horario.HorarioResponseDto;
import pe.utp.repository.HorarioRepository;
import pe.utp.repository.model.Horario;
import pe.utp.service.HorarioService;
import pe.utp.service.exception.CodigoError;
import pe.utp.service.exception.ScafException;
import pe.utp.service.mapper.HorarioMapper;

@Service
@RequiredArgsConstructor
public class HorarioServiceImpl implements HorarioService {

    private final HorarioRepository horarioRepository;
    private final HorarioMapper horarioMapper;

    @Override
    public PaginateResponseDto<HorarioResponseDto> listar(Pageable pageable) {
        Page<HorarioResponseDto> pagina = horarioRepository.findAll(pageable)
                .map(horarioMapper::toResponseDto);

        return new PaginateResponseDto<>(pagina.getContent(), pagina.getTotalElements(), pagina.getTotalPages(), pagina.getNumber());
    }

    @Override
    public HorarioResponseDto buscarPorId(Long id) {
        return horarioRepository.findById(id)
                .map(horarioMapper::toResponseDto)
                .orElseThrow(() -> ScafException.of(CodigoError.HORARIO_NO_ENCONTRADO));
    }

    @Override
    public HorarioResponseDto crear(HorarioRequestDto horarioRequestDto) {
        Horario horario = new Horario();
        horarioMapper.actualizarEntidad(horario, horarioRequestDto);
        return horarioMapper.toResponseDto(horarioRepository.save(horario));
    }

    @Override
    public HorarioResponseDto actualizar(Long id, HorarioRequestDto horarioRequestDto) {
        Horario horarioExistente = horarioRepository.findById(id)
                .orElseThrow(() -> ScafException.of(CodigoError.HORARIO_NO_ENCONTRADO));
        horarioMapper.actualizarEntidad(horarioExistente, horarioRequestDto);
        return horarioMapper.toResponseDto(horarioRepository.save(horarioExistente));
    }

    @Override
    public void eliminar(Long id) {
        if (!horarioRepository.existsById(id)) {
            throw ScafException.of(CodigoError.HORARIO_NO_ENCONTRADO);
        }
        horarioRepository.deleteById(id);
    }
}
