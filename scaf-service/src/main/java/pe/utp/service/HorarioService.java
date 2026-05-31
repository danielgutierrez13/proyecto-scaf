package pe.utp.service;

import org.springframework.data.domain.Pageable;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.horario.HorarioRequestDto;
import pe.utp.dto.horario.HorarioResponseDto;

public interface HorarioService {

    PaginateResponseDto<HorarioResponseDto> listar(Pageable pageable);

    HorarioResponseDto buscarPorId(Long id);

    HorarioResponseDto crear(HorarioRequestDto horarioRequestDto);

    HorarioResponseDto actualizar(Long id, HorarioRequestDto horarioRequestDto);

    void eliminar(Long id);
}
