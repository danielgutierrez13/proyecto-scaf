package pe.utp.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.carrera.CarreraRequestDto;
import pe.utp.dto.carrera.CarreraResponseDto;
import pe.utp.repository.CarreraRepository;
import pe.utp.repository.model.Carrera;
import pe.utp.service.CarreraService;
import pe.utp.service.exception.CodigoError;
import pe.utp.service.exception.ScafException;
import pe.utp.service.mapper.CarreraMapper;

@Service
@RequiredArgsConstructor
public class CarreraServiceImpl implements CarreraService {

    private final CarreraRepository carreraRepository;
    private final CarreraMapper carreraMapper;

    @Override
    public PaginateResponseDto<CarreraResponseDto> listar(Pageable pageable) {
        Page<CarreraResponseDto> pagina = carreraRepository.findAll(pageable)
                .map(carreraMapper::toResponseDto);

        return new PaginateResponseDto<>(
                pagina.getContent(),
                pagina.getTotalElements(),
                pagina.getTotalPages(),
                pagina.getNumber()
        );
    }

    @Override
    public CarreraResponseDto buscarPorId(Long id) {
        return carreraRepository.findById(id)
                .map(carreraMapper::toResponseDto)
                .orElseThrow(() -> ScafException.of(CodigoError.CARRERA_NO_ENCONTRADA));
    }

    @Override
    public CarreraResponseDto crear(CarreraRequestDto carreraRequestDto) {
        Carrera carrera = new Carrera();
        carreraMapper.actualizarEntidad(carrera, carreraRequestDto);
        return carreraMapper.toResponseDto(carreraRepository.save(carrera));
    }

    @Override
    public CarreraResponseDto actualizar(Long id, CarreraRequestDto carreraRequestDto) {
        Carrera carreraExistente = carreraRepository.findById(id)
                .orElseThrow(() -> ScafException.of(CodigoError.CARRERA_NO_ENCONTRADA));
        carreraMapper.actualizarEntidad(carreraExistente, carreraRequestDto);
        return carreraMapper.toResponseDto(carreraRepository.save(carreraExistente));
    }

    @Override
    public void eliminar(Long id) {
        if (!carreraRepository.existsById(id)) {
            throw  ScafException.of(CodigoError.CARRERA_NO_ENCONTRADA);
        }
        carreraRepository.deleteById(id);
    }
}
