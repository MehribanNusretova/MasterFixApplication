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

    public String saveImage(MultipartFile image) {

        if (image == null || image.isEmpty()) {
            throw new AccessDeniedException("Şəkil boş ola bilməz");
        }

        if (!ALLOWED_CONTENT_TYPES.contains(image.getContentType())) {
            throw new AccessDeniedException("Yalnız JPG, PNG və WEBP formatları qəbul edilir");
        }

        try {
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFilename = image.getOriginalFilename();

            String extension = getFileExtension(originalFilename);

            String fileName = UUID.randomUUID() + extension;

            Path filePath = uploadPath.resolve(fileName);

            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Şəkil yüklənərkən xəta baş verdi");
        }
    }

    private String getFileExtension(String filename) {

        if (filename == null || !filename.contains(".")) {
            return ".jpg";
        }

        return filename.substring(filename.lastIndexOf("."));
    }
}