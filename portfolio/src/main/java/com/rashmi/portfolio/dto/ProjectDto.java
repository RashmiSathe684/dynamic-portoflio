package com.rashmi.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ProjectDto {
    @NotBlank(message = "Title is required")
    private String title;
    private String shortDescription;
    private String detailedDescription;
    private String techStack;
    private String githubLink;
    private String liveLink;
    private String imageUrl;
    private String createdDate;
}
