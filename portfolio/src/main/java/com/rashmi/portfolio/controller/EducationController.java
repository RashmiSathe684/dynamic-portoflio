package com.rashmi.portfolio.controller;

import com.rashmi.portfolio.entity.Education;
import com.rashmi.portfolio.service.EducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/education")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EducationController {
    private final EducationService educationService;

    @GetMapping
    public List<Education> getAllEducation() {
        return educationService.getAllEducation();
    }

    @PostMapping
    public ResponseEntity<Education> createEducation(@RequestBody Education education) {
        return ResponseEntity.ok(educationService.saveEducation(education));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEducation(@PathVariable Long id) {
        educationService.deleteEducation(id);
        return ResponseEntity.noContent().build();
    }
}
