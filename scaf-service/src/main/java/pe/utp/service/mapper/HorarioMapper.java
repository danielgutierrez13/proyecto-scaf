package pe.utp.service.mapper;

import org.springframework.stereotype.Component;
import pe.utp.dto.horario.HorarioRequestDto;
import pe.utp.dto.horario.HorarioResponseDto;
import pe.utp.repository.model.Horario;

@Component
public class HorarioMapper {

    public void actualizarEntidad(Horario horario, HorarioRequestDto requestDto) {
        horario.setDia(requestDto.getDia());
        horario.setHoraInicio(requestDto.getHoraInicio());
        horario.setHoraFin(requestDto.getHoraFin());
        horario.setAula(requestDto.getAula());
    }

    public HorarioResponseDto toResponseDto(Horario horario) {
        HorarioResponseDto responseDto = new HorarioResponseDto();
        responseDto.setCodigoHorario(horario.getCodigoHorario());
        responseDto.setDia(horario.getDia());
        responseDto.setHoraInicio(horario.getHoraInicio());
        responseDto.setHoraFin(horario.getHoraFin());
        responseDto.setAula(horario.getAula());
        return responseDto;
    }
}
