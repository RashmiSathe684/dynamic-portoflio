package com.rashmi.portfolio.controller;

import com.rashmi.portfolio.entity.Internship;
import com.rashmi.portfolio.service.CloudinaryService;
import com.rashmi.portfolio.service.InternshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/internships")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InternshipController {
    private final InternshipService internshipService;
    private final CloudinaryService cloudinaryService;

    @GetMapping
    public List<Internship> getAllInternships() {
        return internshipService.getAllInternships();
    }

    @PostMapping
    public ResponseEntity<Internship> createInternship(@RequestBody Internship internship) {
        return ResponseEntity.ok(internshipService.saveInternship(internship));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Internship> updateInternship(@PathVariable Long id, @RequestBody Internship internship) {
        return ResponseEntity.ok(internshipService.updateInternship(id, internship));
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) throws Exception {
        String url = cloudinaryService.uploadImage(file, "internships");
        return ResponseEntity.ok(url);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInternship(@PathVariable Long id) {
        internshipService.deleteInternship(id);
        return ResponseEntity.noContent().build();
    }
}
