package pe.utp.service.impl;

import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pe.utp.repository.RolRepository;
import pe.utp.repository.model.Rol;
import pe.utp.service.RolService;

@Service
@RequiredArgsConstructor
public class RolServiceImpl implements RolService {

    private final RolRepository rolRepository;

    @Override
    public Page<Rol> listar(Pageable pageable) {
        return rolRepository.findAll(pageable);
    }

    @Override
    public Optional<Rol> buscarPorId(Long id) {
        return rolRepository.findById(id);
    }

    @Override
    public Rol crear(Rol rol) {
        return rolRepository.save(rol);
    }

    @Override
    public Optional<Rol> actualizar(Long id, Rol rol) {
        return rolRepository.findById(id)
                .map(rolExistente -> {
                    rolExistente.setNombreRol(rol.getNombreRol());
                    rolExistente.setDescripcion(rol.getDescripcion());
                    return rolRepository.save(rolExistente);
                });
    }

    @Override
    public boolean eliminar(Long id) {
        if (!rolRepository.existsById(id)) {
            return false;
        }
        rolRepository.deleteById(id);
        return true;
    }
}
