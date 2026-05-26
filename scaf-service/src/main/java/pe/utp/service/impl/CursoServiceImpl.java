package pe.utp.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.curso.CursoRequestDto;
import pe.utp.dto.curso.CursoResponseDto;
import pe.utp.repository.CursoRepository;
import pe.utp.repository.model.Curso;
import pe.utp.service.CursoService;
import pe.utp.service.exception.CodigoError;
import pe.utp.service.exception.ScafException;
import pe.utp.service.mapper.CursoMapper;

@Service
@RequiredArgsConstructor
public class CursoServiceImpl implements CursoService {

    private final CursoRepository cursoRepository;
    private final CursoMapper cursoMapper;

    @Override
    public PaginateResponseDto<CursoResponseDto> listar(Pageable pageable) {
        Page<CursoResponseDto> pagina = cursoRepository.findAll(pageable)
                .map(cursoMapper::toResponseDto);

        return new PaginateResponseDto<>(pagina.getContent(), pagina.getTotalElements(), pagina.getTotalPages(), pagina.getNumber());
    }

    @Override
    public CursoResponseDto buscarPorId(Long id) {
        return cursoRepository.findById(id)
                .map(cursoMapper::toResponseDto)
                .orElseThrow(() -> ScafException.of(CodigoError.CURSO_NO_ENCONTRADO));
    }

    @Override
    public CursoResponseDto crear(CursoRequestDto cursoRequestDto) {
        Curso curso = new Curso();
        cursoMapper.actualizarEntidad(curso, cursoRequestDto);
        return cursoMapper.toResponseDto(cursoRepository.save(curso));
    }

    @Override
    public CursoResponseDto actualizar(Long id, CursoRequestDto cursoRequestDto) {
        Curso cursoExistente = cursoRepository.findById(id)
                .orElseThrow(() -> ScafException.of(CodigoError.CURSO_NO_ENCONTRADO));
        cursoMapper.actualizarEntidad(cursoExistente, cursoRequestDto);
        return cursoMapper.toResponseDto(cursoRepository.save(cursoExistente));
    }

    @Override
    public void eliminar(Long id) {
        if (!cursoRepository.existsById(id)) {
            throw ScafException.of(CodigoError.CURSO_NO_ENCONTRADO);
        }
        cursoRepository.deleteById(id);
    }
}
