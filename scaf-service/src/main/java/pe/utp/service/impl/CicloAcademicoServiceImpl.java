package pe.utp.service.impl;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.cicloAcademico.CicloAcademicoRequestDto;
import pe.utp.dto.cicloAcademico.CicloAcademicoResponseDto;
import pe.utp.repository.CicloAcademicoRepository;
import pe.utp.repository.model.CicloAcademico;
import pe.utp.service.CicloAcademicoService;
import pe.utp.service.exception.CodigoError;
import pe.utp.service.exception.ScafException;
import pe.utp.service.mapper.CicloAcademicoMapper;

@Service
@RequiredArgsConstructor
public class CicloAcademicoServiceImpl implements CicloAcademicoService {

    private final CicloAcademicoRepository cicloAcademicoRepository;
    private final CicloAcademicoMapper cicloAcademicoMapper;

    @Override
    public PaginateResponseDto<CicloAcademicoResponseDto> listar(Pageable pageable) {
        Page<CicloAcademicoResponseDto> pagina = cicloAcademicoRepository.findAll(pageable)
                .map(cicloAcademicoMapper::toResponseDto);

        return new PaginateResponseDto<>(
                pagina.getContent(),
                pagina.getTotalElements(),
                pagina.getTotalPages(),
                pagina.getNumber()
        );
    }

    @Override
    public CicloAcademicoResponseDto buscarPorId(Long id) {
        return cicloAcademicoRepository.findById(id)
                .map(cicloAcademicoMapper::toResponseDto)
                .orElseThrow(() -> ScafException.of(CodigoError.CICLO_ACADEMICO_NO_ENCONTRADO));
    }

    @Override
    @Transactional
    public CicloAcademicoResponseDto crear(CicloAcademicoRequestDto requestDto) {
        if (Boolean.TRUE.equals(requestDto.getVigente())) {
            cicloAcademicoRepository.desactivarTodos();
        }
        CicloAcademico cicloAcademico = new CicloAcademico();
        cicloAcademicoMapper.actualizarEntidad(cicloAcademico, requestDto);
        return cicloAcademicoMapper.toResponseDto(cicloAcademicoRepository.save(cicloAcademico));
    }

    @Override
    @Transactional
    public CicloAcademicoResponseDto actualizar(Long id, CicloAcademicoRequestDto requestDto) {
        CicloAcademico existente = cicloAcademicoRepository.findById(id)
                .orElseThrow(() -> ScafException.of(CodigoError.CICLO_ACADEMICO_NO_ENCONTRADO));

        if (Boolean.TRUE.equals(requestDto.getVigente())) {
            cicloAcademicoRepository.desactivarTodos();
        }
        cicloAcademicoMapper.actualizarEntidad(existente, requestDto);
        return cicloAcademicoMapper.toResponseDto(cicloAcademicoRepository.save(existente));
    }

    @Override
    public void eliminar(Long id) {
        if (!cicloAcademicoRepository.existsById(id)) {
            throw ScafException.of(CodigoError.CICLO_ACADEMICO_NO_ENCONTRADO);
        }
        cicloAcademicoRepository.deleteById(id);
    }
}
