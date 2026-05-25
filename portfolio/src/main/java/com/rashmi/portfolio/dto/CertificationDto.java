package com.rashmi.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CertificationDto {
    @NotBlank(message = "Title is required")
    private String title;
    private String organization;
    private String description;
    private LocalDate issueDate;
    private String imageUrl;
    private String certificateLink;
}
