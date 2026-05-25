package com.rashmi.portfolio.controller;

import com.rashmi.portfolio.dto.AchievementDto;
import com.rashmi.portfolio.entity.Achievement;
import com.rashmi.portfolio.service.AchievementService;
import com.rashmi.portfolio.service.CloudinaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/achievements")
@RequiredArgsConstructor
public class AchievementController {

    private final AchievementService achievementService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    public ResponseEntity<Page<Achievement>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {
        return ResponseEntity.ok(achievementService.getAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Achievement> getById(@PathVariable Long id) {
        return ResponseEntity.ok(achievementService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Achievement> create(@Valid @RequestBody AchievementDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(achievementService.create(dto));
    }

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) throws Exception {
        String url = cloudinaryService.uploadImage(file, "achievements");
        return ResponseEntity.ok(url);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Achievement> update(@PathVariable Long id, @Valid @RequestBody AchievementDto dto) {
        return ResponseEntity.ok(achievementService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        achievementService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
