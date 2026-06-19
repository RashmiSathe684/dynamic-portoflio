package com.rashmi.portfolio.service;

import com.rashmi.portfolio.dto.PortfolioDetailsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PortfolioDetailsService {

    private final ProfileSettingsService profileSettingsService;
    private final SkillService skillService;
    private final ProjectService projectService;
    private final AchievementService achievementService;
    private final CertificationService certificationService;
    private final InternshipService internshipService;
    private final EducationService educationService;

    public PortfolioDetailsDto getPortfolioDetails() {
        return PortfolioDetailsDto.builder()
                .profile(profileSettingsService.getSettings())
                .skills(skillService.getAllSkills())
                .projects(projectService.getAllProjects(0, 100, null, null).getContent())
                .achievements(achievementService.getAll(0, 100).getContent())
                .certifications(certificationService.getAll(0, 100).getContent())
                .internships(internshipService.getAllInternships())
                .education(educationService.getAllEducation())
                .build();
    }
}
