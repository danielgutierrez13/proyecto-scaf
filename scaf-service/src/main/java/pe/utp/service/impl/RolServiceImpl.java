package pe.utp.service.impl;

import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.rol.RolRequestDto;
import pe.utp.dto.rol.RolResponseDto;
import pe.utp.repository.RolRepository;
import pe.utp.repository.model.Rol;
import pe.utp.service.RolService;
import pe.utp.service.exception.CodigoError;
import pe.utp.service.exception.ScafException;
import pe.utp.service.mapper.RolMapper;

@Service
@RequiredArgsConstructor
public class RolServiceImpl implements RolService {

    private final RolRepository rolRepository;
    private final RolMapper rolMapper;

    @Override
    public PaginateResponseDto<RolResponseDto> listar(Pageable pageable) {
        Page<RolResponseDto> pagina = rolRepository.findAll(pageable)
                .map(rolMapper::toResponseDto);

        return new PaginateResponseDto<>(
                pagina.getContent(),
                pagina.getTotalElements(),
                pagina.getTotalPages(),
                pagina.getNumber()
        );
    }

    @Override
    public RolResponseDto buscarPorId(Long id) {
        return rolRepository.findById(id)
                .map(rolMapper::toResponseDto)
                .orElseThrow(() -> ScafException.of(CodigoError.ROL_NO_ENCONTRADO));
    }

    @Override
    public RolResponseDto crear(RolRequestDto rolRequestDto) {
        Rol rol = new Rol();
        rolMapper.actualizarEntidad(rol,  rolRequestDto);
        return rolMapper.toResponseDto(rolRepository.save(rol));
    }

    @Override
    public RolResponseDto actualizar(Long id, RolRequestDto rolRequestDto) {
        Rol rolExistente = rolRepository.findById(id)
                .orElseThrow(() -> ScafException.of(CodigoError.ROL_NO_ENCONTRADO));
        rolMapper.actualizarEntidad(rolExistente, rolRequestDto);
        return rolMapper.toResponseDto(rolRepository.save(rolExistente));
    }

    @Override
    public void eliminar(Long id) {
        if (!rolRepository.existsById(id)) {
            throw ScafException.of(CodigoError.ROL_NO_ENCONTRADO);
        }
        rolRepository.deleteById(id);
    }
}
