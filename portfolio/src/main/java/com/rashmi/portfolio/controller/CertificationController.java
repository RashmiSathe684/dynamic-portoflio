package com.rashmi.portfolio.controller;

import com.rashmi.portfolio.dto.CertificationDto;
import com.rashmi.portfolio.entity.Certification;
import com.rashmi.portfolio.service.CertificationService;
import com.rashmi.portfolio.service.CloudinaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/certifications")
@RequiredArgsConstructor
public class CertificationController {

    private final CertificationService certificationService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    public ResponseEntity<Page<Certification>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        return ResponseEntity.ok(certificationService.getAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Certification> getById(@PathVariable Long id) {
        return ResponseEntity.ok(certificationService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Certification> create(@Valid @RequestBody CertificationDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(certificationService.create(dto));
    }

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) throws Exception {
        String url = cloudinaryService.uploadImage(file, "certifications");
        return ResponseEntity.ok(url);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Certification> update(@PathVariable Long id, @Valid @RequestBody CertificationDto dto) {
        return ResponseEntity.ok(certificationService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        certificationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

