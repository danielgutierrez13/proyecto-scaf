package pe.utp.service.mapper;

import org.springframework.stereotype.Component;
import pe.utp.dto.cicloAcademico.CicloAcademicoRequestDto;
import pe.utp.dto.cicloAcademico.CicloAcademicoResponseDto;
import pe.utp.repository.model.CicloAcademico;

@Component
public class CicloAcademicoMapper {

    public void actualizarEntidad(CicloAcademico cicloAcademico, CicloAcademicoRequestDto requestDto){
        cicloAcademico.setAnio(requestDto.getAnio());
        cicloAcademico.setSemestre(requestDto.getSemestre());
        cicloAcademico.setDescripcion(requestDto.getDescripcion());
    }

    public CicloAcademicoResponseDto toResponseDto(CicloAcademico cicloAcademico){
        CicloAcademicoResponseDto responseDto = new CicloAcademicoResponseDto();
        responseDto.setCodigoCicloAcademico(cicloAcademico.getCodigoCicloAcademico());
        responseDto.setAnio(cicloAcademico.getAnio());
        responseDto.setSemestre(cicloAcademico.getSemestre());
        responseDto.setDescripcion(cicloAcademico.getDescripcion());

        return responseDto;
    }
}
