package com.rashmi.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class AchievementDto {
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    private LocalDate achievementDate;
    private String imageUrl;
}
