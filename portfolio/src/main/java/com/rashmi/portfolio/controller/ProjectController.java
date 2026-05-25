package com.rashmi.portfolio.controller;

import com.rashmi.portfolio.dto.ProjectDto;
import com.rashmi.portfolio.entity.Project;
import com.rashmi.portfolio.service.CloudinaryService;
import com.rashmi.portfolio.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final CloudinaryService cloudinaryService;

    // PUBLIC - GET all with pagination + search
    @GetMapping
    public ResponseEntity<Page<Project>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(projectService.getAllProjects(page, size, sort, search));
    }

    // PUBLIC - GET single
    @GetMapping("/{id}")
    public ResponseEntity<Project> getById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    // ADMIN - CREATE
    @PostMapping
    public ResponseEntity<Project> create(@Valid @RequestBody ProjectDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(dto));
    }

    // ADMIN - UPLOAD IMAGE
    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) throws Exception {
        String url = cloudinaryService.uploadImage(file, "projects");
        return ResponseEntity.ok(url);
    }

    // ADMIN - UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Project> update(@PathVariable Long id, @Valid @RequestBody ProjectDto dto) {
        return ResponseEntity.ok(projectService.updateProject(id, dto));
    }

    // ADMIN - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}

