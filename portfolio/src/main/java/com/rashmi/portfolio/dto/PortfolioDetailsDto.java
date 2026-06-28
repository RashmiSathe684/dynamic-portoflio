package com.rashmi.portfolio.dto;

import com.rashmi.portfolio.entity.*;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class PortfolioDetailsDto {
    private ProfileSettings profile;
    private List<Skill> skills;
    private List<Project> projects;
    private List<Achievement> achievements;
    private List<Certification> certifications;
    private List<Internship> internships;
}
