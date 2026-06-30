package pe.utp.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.javacpp.BytePointer;
import org.bytedeco.javacpp.Loader;
import org.bytedeco.opencv.global.opencv_objdetect;
import org.bytedeco.opencv.opencv_core.*;
import org.bytedeco.opencv.opencv_face.*;
import org.bytedeco.opencv.opencv_objdetect.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pe.utp.repository.InscripcionRepository;
import pe.utp.repository.UsuarioRepository;
import pe.utp.repository.model.Inscripcion;
import pe.utp.repository.model.Usuario;
import pe.utp.service.exception.CodigoError;
import pe.utp.service.exception.ScafException;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.bytedeco.opencv.global.opencv_core.CV_8UC1;
import static org.bytedeco.opencv.global.opencv_imgcodecs.*;
import static org.bytedeco.opencv.global.opencv_imgproc.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class RostroService {

    @Value("${faces.storage.path}")
    private String storagePath;

    @Value("${faces.storage.url}")
    private String storageUrl;

    private final UsuarioRepository usuarioRepository;
    private final InscripcionRepository inscripcionRepository;

    private CascadeClassifier faceDetector;

    /** Umbral LBPH: distancia < threshold = reconocido. */
    private static final double LBPH_THRESHOLD = 90.0;

    @PostConstruct
    public void init() throws IOException {
        // Carga las librerías nativas de OpenCV
        Loader.load(opencv_objdetect.class);

        // CascadeClassifier necesita una ruta física en disco, no un InputStream.
        // Copiamos el XML (bundled en resources/haarcascades/) a un archivo temporal.
        try (InputStream cascadeStream = getClass().getResourceAsStream(
                "/haarcascades/haarcascade_frontalface_default.xml")) {

            if (cascadeStream == null) {
                throw new IllegalStateException(
                        "No se encontró haarcascade_frontalface_default.xml en resources/haarcascades/");
            }

            Path tempCascade = Files.createTempFile("haarcascade_frontalface_default", ".xml");
            tempCascade.toFile().deleteOnExit();
            Files.copy(cascadeStream, tempCascade, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            faceDetector = new CascadeClassifier(tempCascade.toString());
        }

        if (faceDetector.empty()) {
            throw new IllegalStateException("El clasificador Haar quedó vacío tras la carga.");
        }
        log.info("Clasificador de rostros cargado correctamente");
    }

    /**
     * Procesa una lista de imágenes, detecta rostros en cada una y guarda
     * únicamente las que contienen al menos un rostro válido.
     *
     * @return número de imágenes con rostro guardadas
     */
    public int guardarRostros(Long usuarioId, List<MultipartFile> imagenes) throws IOException {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> ScafException.of(CodigoError.USUARIO_NO_ENCONTRADO));

        String codigo = usuario.getCodigoUniversitario();
        Path dir = Paths.get(storagePath, codigo);
        Files.createDirectories(dir);

        int guardados = 0;

        for (MultipartFile imagen : imagenes) {
            byte[] bytes = imagen.getBytes();

            // Decodifica los bytes como imagen OpenCV
            Mat buf = new Mat(1, bytes.length, CV_8UC1, new BytePointer(bytes));
            Mat mat = imdecode(buf, IMREAD_COLOR);

            if (mat == null || mat.empty()) {
                log.warn("No se pudo decodificar la imagen: {}", imagen.getOriginalFilename());
                continue;
            }

            // Convierte a escala de grises y ecualiza el histograma
            Mat gray = new Mat();
            cvtColor(mat, gray, COLOR_BGR2GRAY);
            equalizeHist(gray, gray);

            // Detecta rostros
            RectVector rostros = new RectVector();
            faceDetector.detectMultiScale(gray, rostros, 1.1, 3, 0,
                    new Size(30, 30), new Size());

            if (rostros.size() == 0) {
                log.info("No se detectó rostro en la imagen: {}", imagen.getOriginalFilename());
                continue;
            }

            // Guarda la imagen válida en el directorio del estudiante
            String filename = (guardados + 1) + ".jpg";
            Path destino = dir.resolve(filename);
            imwrite(destino.toString(), mat);
            guardados++;
            log.info("Rostro guardado: {}", destino);
        }

        // Actualiza fotoUsuario con la URL base del directorio de rostros
        if (guardados > 0 && usuario.getFotoUsuario() == null) {
            usuario.setFotoUsuario(storageUrl + "/" + codigo + "/1.jpg");
            usuarioRepository.save(usuario);
        }

        return guardados;
    }

    /**
     * Reconoce a un estudiante a partir de una imagen capturada por la cámara,
     * comparándola contra las fotos almacenadas de los inscritos en la asignación.
     *
     * @param codigoAsignacion id de la asignación activa
     * @param imagenBytes      bytes JPEG de la imagen capturada
     * @return el Usuario reconocido, o empty si no se identificó a nadie
     */
    public Optional<Usuario> reconocerEstudiante(Long codigoAsignacion, byte[] imagenBytes) {
        List<Inscripcion> inscripciones = inscripcionRepository.findByAsignacion_CodigoAsignacion(codigoAsignacion);
        if (inscripciones.isEmpty()) return Optional.empty();

        MatVector imagenes = new MatVector();
        List<Integer> etiquetas = new ArrayList<>();
        List<Usuario> estudiantesPorEtiqueta = new ArrayList<>();

        int etiqueta = 0;
        for (Inscripcion inscripcion : inscripciones) {
            Usuario estudiante = inscripcion.getEstudiante();
            if (estudiante == null) continue;

            Path carpeta = Paths.get(storagePath, estudiante.getCodigoUniversitario());
            if (!Files.exists(carpeta)) continue;

            File[] fotos = carpeta.toFile().listFiles((d, n) -> n.endsWith(".jpg"));
            if (fotos == null || fotos.length == 0) continue;

            for (File foto : fotos) {
                Mat imagen = imread(foto.getAbsolutePath(), 0); // escala de grises
                if (imagen.empty()) continue;
                Mat resized = new Mat();
                resize(imagen, resized, new Size(100, 100));
                imagenes.push_back(resized);
                etiquetas.add(etiqueta);
            }
            estudiantesPorEtiqueta.add(estudiante);
            etiqueta++;
        }

        if (imagenes.size() == 0) return Optional.empty();

        // Convierte lista de etiquetas a Mat
        Mat labelMat = new Mat(etiquetas.size(), 1, org.bytedeco.opencv.global.opencv_core.CV_32SC1);
        for (int i = 0; i < etiquetas.size(); i++) {
            labelMat.ptr(i).putInt(etiquetas.get(i));
        }

        LBPHFaceRecognizer recognizer = LBPHFaceRecognizer.create();
        recognizer.train(imagenes, labelMat);

        // Decodifica y prepara la imagen capturada
        Mat buf = new Mat(1, imagenBytes.length, CV_8UC1, new BytePointer(imagenBytes));
        Mat capturada = imdecode(buf, 0); // escala de grises
        if (capturada.empty()) return Optional.empty();

        Mat capturadaResized = new Mat();
        resize(capturada, capturadaResized, new Size(100, 100));

        int[] prediccion = {-1};
        double[] confianza = {0.0};
        recognizer.predict(capturadaResized, prediccion, confianza);

        log.info("Reconocimiento: etiqueta={}, confianza={}", prediccion[0], confianza[0]);

        if (prediccion[0] >= 0 && confianza[0] < LBPH_THRESHOLD
                && prediccion[0] < estudiantesPorEtiqueta.size()) {
            return Optional.of(estudiantesPorEtiqueta.get(prediccion[0]));
        }
        return Optional.empty();
    }

    /**
     * Verifica si un estudiante ya tiene fotos de rostro registradas.
     */
    public boolean tieneRostrosRegistrados(String codigoUniversitario) {
        Path carpeta = Paths.get(storagePath, codigoUniversitario);
        if (!Files.exists(carpeta)) return false;
        File[] fotos = carpeta.toFile().listFiles((d, n) -> n.endsWith(".jpg"));
        return fotos != null && fotos.length > 0;
    }

    /**
     * Elimina todas las imágenes de rostro almacenadas para un estudiante.
     */
    public void eliminarRostros(Long usuarioId) throws IOException {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> ScafException.of(CodigoError.USUARIO_NO_ENCONTRADO));

        Path dir = Paths.get(storagePath, usuario.getCodigoUniversitario());
        if (Files.exists(dir)) {
            Files.walk(dir)
                    .sorted(java.util.Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(File::delete);
        }
    }
}
