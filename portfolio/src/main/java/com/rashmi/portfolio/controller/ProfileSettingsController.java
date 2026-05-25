package com.rashmi.portfolio.controller;

import com.rashmi.portfolio.entity.ProfileSettings;
import com.rashmi.portfolio.service.ProfileSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileSettingsController {
    private final ProfileSettingsService service;
    private final String UPLOAD_DIR = "uploads/";

    @GetMapping
    public ResponseEntity<ProfileSettings> getSettings() {
        return ResponseEntity.ok(service.getSettings());
    }

    @PostMapping("/update")
    public ResponseEntity<ProfileSettings> updateSettings(@RequestBody ProfileSettings settings) {
        return ResponseEntity.ok(service.updateSettings(settings));
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null) {
            Path p = Paths.get(originalFilename).getFileName();
            originalFilename = p != null ? p.toString() : "file";
            originalFilename = originalFilename.replaceAll("\\s+", "_");
        } else {
            originalFilename = "file";
        }
        String fileName = UUID.randomUUID().toString() + "_" + originalFilename;
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        return ResponseEntity.ok(fileName);
    }
}
