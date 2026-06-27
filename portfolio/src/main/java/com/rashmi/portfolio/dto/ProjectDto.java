package com.rashmi.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ProjectDto {
    @NotBlank(message = "Title is required")
    private String title;
    private String shortDescription;
    private String detailedDescription;
    private String techStack;

    @URL(message = "GitHub Link must be a valid URL")
    private String githubLink;

    @URL(message = "Live Link must be a valid URL")
    private String liveLink;

    @URL(message = "Image URL must be a valid URL")
    private String imageUrl;
    
    private String createdDate;
}
