package pe.utp.service;

import org.springframework.data.domain.Pageable;
import pe.utp.dto.PaginateResponseDto;
import pe.utp.dto.cicloAcademico.CicloAcademicoRequestDto;
import pe.utp.dto.cicloAcademico.CicloAcademicoResponseDto;

public interface CicloAcademicoService {

    PaginateResponseDto<CicloAcademicoResponseDto> listar(Pageable pageable);

    CicloAcademicoResponseDto buscarPorId(Long id);

    CicloAcademicoResponseDto crear(CicloAcademicoRequestDto cicloAcademicoRequestDto);

    CicloAcademicoResponseDto actualizar(Long id, CicloAcademicoRequestDto cicloAcademicoRequestDto);

    void eliminar(Long id);
}
