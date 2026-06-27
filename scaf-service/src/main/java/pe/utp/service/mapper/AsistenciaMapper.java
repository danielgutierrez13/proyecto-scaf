package pe.utp.service.mapper;

import org.springframework.stereotype.Component;
import pe.utp.dto.asistencia.AsistenciaRequestDto;
import pe.utp.dto.asistencia.AsistenciaResponseDto;
import pe.utp.repository.model.Asignacion;
import pe.utp.repository.model.Asistencia;
import pe.utp.repository.model.TipoAsistencia;
import pe.utp.repository.model.Usuario;

@Component
public class AsistenciaMapper {

    public void actualizarEntidad(
            Asistencia asistencia,
            AsistenciaRequestDto requestDto,
            Usuario usuario,
            Asignacion asignacion,
            TipoAsistencia tipoAsistencia
    ) {
        asistencia.setUsuario(usuario);
        asistencia.setAsignacion(asignacion);
        asistencia.setFecha(requestDto.getFecha());
        asistencia.setHoraIngreso(requestDto.getHoraIngreso());
        asistencia.setEstado(requestDto.getEstado());
        asistencia.setTipoAsistencia(tipoAsistencia);
    }

    public AsistenciaResponseDto toResponseDto(Asistencia asistencia) {
        AsistenciaResponseDto responseDto = new AsistenciaResponseDto();
        responseDto.setCodigoAsistencia(asistencia.getCodigoAsistencia());
        responseDto.setFecha(asistencia.getFecha());
        responseDto.setHoraIngreso(asistencia.getHoraIngreso());
        responseDto.setEstado(asistencia.getEstado());

        if (asistencia.getUsuario() != null) {
            responseDto.setCodigoUsuario(asistencia.getUsuario().getCodigoUsusario());
            responseDto.setNombreUsuario(asistencia.getUsuario().getNombres());
        }

        if (asistencia.getAsignacion() != null) {
            responseDto.setCodigoAsignacion(asistencia.getAsignacion().getCodigoAsignacion());
            if (asistencia.getAsignacion().getCurso() != null) {
                responseDto.setNombreCurso(asistencia.getAsignacion().getCurso().getNombre());
            }
        }

        if (asistencia.getTipoAsistencia() != null) {
            responseDto.setCodigoTipoAsistencia(asistencia.getTipoAsistencia().getCodigoTipoAsistencia());
            responseDto.setNombreTipoAsistencia(asistencia.getTipoAsistencia().getNombre());
        }

        return responseDto;
    }
}
