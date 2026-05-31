package pe.utp.service;

import org.springframework.data.domain.Pageable;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.carrera.CarreraRequestDto;
import pe.utp.dto.carrera.CarreraResponseDto;

public interface CarreraService {

    PaginateResponseDto<CarreraResponseDto> listar(Pageable pageable);

    CarreraResponseDto buscarPorId(Long id);

    CarreraResponseDto crear(CarreraRequestDto carreraRequestDto);

    CarreraResponseDto actualizar(Long id, CarreraRequestDto carreraRequestDto);

    void eliminar(Long id);
}
