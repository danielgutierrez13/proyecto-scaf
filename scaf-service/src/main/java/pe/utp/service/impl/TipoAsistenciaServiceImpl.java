package pe.utp.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.tipoAsistencia.TipoAsistenciaRequestDto;
import pe.utp.dto.tipoAsistencia.TipoAsistenciaResponseDto;
import pe.utp.repository.TipoAsistenciaRepository;
import pe.utp.repository.model.TipoAsistencia;
import pe.utp.service.TipoAsistenciaService;
import pe.utp.service.exception.CodigoError;
import pe.utp.service.exception.ScafException;
import pe.utp.service.mapper.TipoAsistenciaMapper;

@Service
@RequiredArgsConstructor
public class TipoAsistenciaServiceImpl implements TipoAsistenciaService {

    private final TipoAsistenciaRepository tipoAsistenciaRepository;
    private final TipoAsistenciaMapper tipoAsistenciaMapper;

    @Override
    public PaginateResponseDto<TipoAsistenciaResponseDto> listar(Pageable pageable) {
        Page<TipoAsistenciaResponseDto> pagina = tipoAsistenciaRepository.findAll(pageable)
                .map(tipoAsistenciaMapper::toResponseDto);

        return new PaginateResponseDto<>(pagina.getContent(), pagina.getTotalElements(), pagina.getTotalPages(), pagina.getNumber());
    }

    @Override
    public TipoAsistenciaResponseDto buscarPorId(Long id) {
        return tipoAsistenciaRepository.findById(id)
                .map(tipoAsistenciaMapper::toResponseDto)
                .orElseThrow(() -> ScafException.of(CodigoError.TIPO_ASISTENCIA_NO_ENCONTRADO));
    }

    @Override
    public TipoAsistenciaResponseDto crear(TipoAsistenciaRequestDto tipoAsistenciaRequestDto) {
        TipoAsistencia tipoAsistencia = new TipoAsistencia();
        tipoAsistenciaMapper.actualizarEntidad(tipoAsistencia, tipoAsistenciaRequestDto);
        return tipoAsistenciaMapper.toResponseDto(tipoAsistenciaRepository.save(tipoAsistencia));
    }

    @Override
    public TipoAsistenciaResponseDto actualizar(Long id, TipoAsistenciaRequestDto tipoAsistenciaRequestDto) {
        TipoAsistencia tipoAsistenciaExistente = tipoAsistenciaRepository.findById(id)
                .orElseThrow(() -> ScafException.of(CodigoError.TIPO_ASISTENCIA_NO_ENCONTRADO));
        tipoAsistenciaMapper.actualizarEntidad(tipoAsistenciaExistente, tipoAsistenciaRequestDto);
        return tipoAsistenciaMapper.toResponseDto(tipoAsistenciaRepository.save(tipoAsistenciaExistente));
    }

    @Override
    public void eliminar(Long id) {
        if (!tipoAsistenciaRepository.existsById(id)) {
            throw ScafException.of(CodigoError.TIPO_ASISTENCIA_NO_ENCONTRADO);
        }
        tipoAsistenciaRepository.deleteById(id);
    }
}
