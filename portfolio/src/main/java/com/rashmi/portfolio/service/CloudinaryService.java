package com.rashmi.portfolio.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, String folder) throws IOException {
        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null && originalFilename.toLowerCase().endsWith(".pdf")) {
            java.nio.file.Path uploadPath = java.nio.file.Paths.get("uploads");
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }
            String cleanedName = originalFilename.replaceAll("\\s+", "_");
            String fileName = java.util.UUID.randomUUID().toString() + "_" + cleanedName;
            java.nio.file.Path filePath = uploadPath.resolve(fileName);
            java.nio.file.Files.copy(file.getInputStream(), filePath);
            return fileName;
        }

        Map uploadResult = cloudinary.uploader().upload(
            file.getBytes(),
            ObjectUtils.asMap(
                "folder", "portfolio/" + folder,
                "resource_type", "auto"
            )
        );
        return (String) uploadResult.get("secure_url");
    }

    public void deleteImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return;
        }
        if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
            try {
                java.nio.file.Path filePath = java.nio.file.Paths.get("uploads").resolve(imageUrl);
                java.nio.file.Files.deleteIfExists(filePath);
            } catch (IOException e) {
                System.err.println("Failed to delete local file: " + e.getMessage());
            }
            return;
        }
        try {
            // Extract public_id from URL
            String[] parts = imageUrl.split("/");
            String publicId = parts[parts.length - 1].split("\\.")[0];
            cloudinary.uploader().destroy("portfolio/" + publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            System.err.println("Failed to delete image from Cloudinary: " + e.getMessage());
        }
    }
}
