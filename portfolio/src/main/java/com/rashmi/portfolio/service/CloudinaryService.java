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
