package com.example.masterfix.service;

import com.example.masterfix.exception.AccessDeniedException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private static final Set<String> ALLOWED_MEDIA_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "video/mp4",
            "video/webm"
    );

    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    private static final long MAX_MEDIA_SIZE = 50 * 1024 * 1024;

    public String saveImage(MultipartFile image) {

        if (image == null || image.isEmpty()) {
            throw new AccessDeniedException("Şəkil boş ola bilməz");
        }

        if (image.getSize() > MAX_IMAGE_SIZE) {
            throw new AccessDeniedException(
                    "Maksimum şəkil ölçüsü 5 MB ola bilər"
            );
        }

        if (!ALLOWED_CONTENT_TYPES.contains(image.getContentType())) {
            throw new AccessDeniedException("Yalnız JPG, PNG və WEBP formatları qəbul edilir");
        }

        return saveFile(image);
    }

    public String saveMedia(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AccessDeniedException("Fayl boş ola bilməz");
        }

        if (file.getSize() > MAX_MEDIA_SIZE) {
            throw new AccessDeniedException(
                    "Maksimum fayl ölçüsü 50 MB ola bilər"
            );
        }

        if (!ALLOWED_MEDIA_TYPES.contains(file.getContentType())) {
            throw new AccessDeniedException("Yalnız şəkil (JPG, PNG, WEBP) və video (MP4, WEBM) formatları qəbul edilir");
        }

        return saveFile(file);
    }

    private String saveFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = getFileExtension(originalFilename);
            String fileName = UUID.randomUUID() + extension;

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Fayl yüklənərkən xəta baş verdi");
        }
    }


    private String getFileExtension(String filename) {

        if (filename == null || !filename.contains(".")) {
            return ".jpg";
        }

        return filename.substring(filename.lastIndexOf("."));
    }
}