package com.rashmi.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CertificationDto {
    @NotBlank(message = "Title is required")
    private String title;
    private String organization;
    private String description;
    private LocalDate issueDate;

    @URL(message = "Image URL must be a valid URL")
    private String imageUrl;

    @URL(message = "Certificate Link must be a valid URL")
    private String certificateLink;
}
