package pe.utp.service.impl;

import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pe.utp.repository.CarreraRepository;
import pe.utp.repository.model.Carrera;
import pe.utp.service.CarreraService;

@Service
@RequiredArgsConstructor
public class CarreraServiceImpl implements CarreraService {

    private final CarreraRepository carreraRepository;

    @Override
    public Page<Carrera> listar(Pageable pageable) {
        return carreraRepository.findAll(pageable);
    }

    @Override
    public Optional<Carrera> buscarPorId(Long id) {
        return carreraRepository.findById(id);
    }

    @Override
    public Carrera crear(Carrera carrera) {
        return carreraRepository.save(carrera);
    }

    @Override
    public Optional<Carrera> actualizar(Long id, Carrera carrera) {
        return carreraRepository.findById(id)
                .map(existente -> {
                    existente.setNombreCarrera(carrera.getNombreCarrera());
                    existente.setDescripcion(carrera.getDescripcion());
                    return carreraRepository.save(existente);
                });
    }

    @Override
    public boolean eliminar(Long id) {
        if (!carreraRepository.existsById(id)) {
            return false;
        }
        carreraRepository.deleteById(id);
        return true;
    }
}
