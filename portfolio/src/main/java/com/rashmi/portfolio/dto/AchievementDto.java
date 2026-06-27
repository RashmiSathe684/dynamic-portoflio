package com.rashmi.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AchievementDto {
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    private LocalDate achievementDate;

    @URL(message = "Image URL must be a valid URL")
    private String imageUrl;
}
