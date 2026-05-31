package pe.utp.service.mapper;

import org.springframework.stereotype.Component;
import pe.utp.dto.carrera.CarreraRequestDto;
import pe.utp.dto.carrera.CarreraResponseDto;
import pe.utp.repository.model.Carrera;

@Component
public class CarreraMapper {

    public void actualizarEntidad(Carrera carrera, CarreraRequestDto requestDto) {
        carrera.setNombreCarrera(requestDto.getNombreCarrera());
        carrera.setDescripcion(requestDto.getDescripcion());

    }

    public CarreraResponseDto toResponseDto(Carrera carrera) {
        CarreraResponseDto responseDto = new CarreraResponseDto();
        responseDto.setCodigoCarrera( carrera.getCodigoCarrera());
        responseDto.setNombreCarrera(carrera.getNombreCarrera());
        responseDto.setDescripcion(carrera.getDescripcion());

        return responseDto;
    }
}
