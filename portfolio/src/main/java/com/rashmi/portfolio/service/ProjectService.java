package com.rashmi.portfolio.service;
import com.rashmi.portfolio.dto.ProjectDto;
import com.rashmi.portfolio.entity.Project;
import com.rashmi.portfolio.exception.ResourceNotFoundException;
import com.rashmi.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    private static int getStartScore(String durationStr) {
        if (durationStr == null || durationStr.isBlank()) {
            return 0;
        }
        String lower = durationStr.toLowerCase().trim();
        int startYear = 0;
        int startMonth = 0;

        Pattern yearPattern = Pattern.compile("\\b(20\\d{2}|19\\d{2})\\b");
        Matcher yearMatcher = yearPattern.matcher(durationStr);
        int firstYear = 0;
        if (yearMatcher.find()) {
            firstYear = Integer.parseInt(yearMatcher.group(1));
        }

        int firstShortYear = 0;
        Pattern shortYearPattern = Pattern.compile("\\b\\d{2}\\b");
        Matcher shortYearMatcher = shortYearPattern.matcher(durationStr);
        if (shortYearMatcher.find()) {
            firstShortYear = Integer.parseInt(shortYearMatcher.group(0)) + 2000;
        }

        startYear = firstYear > 0 ? firstYear : firstShortYear;

        List<String> months = Arrays.asList("jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec");
        int firstMonthPos = -1;
        for (int i = 0; i < months.size(); i++) {
            int pos = lower.indexOf(months.get(i));
            if (pos != -1 && (firstMonthPos == -1 || pos < firstMonthPos)) {
                firstMonthPos = pos;
                startMonth = i + 1;
            }
        }

        return startYear * 100 + startMonth;
    }

    private static int getEndScore(String durationStr) {
        if (durationStr == null || durationStr.isBlank()) {
            return 0;
        }
        String lower = durationStr.toLowerCase().trim();
        if (lower.contains("present")) {
            return 999912;
        }
        int endYear = 0;
        int endMonth = 0;

        Pattern yearPattern = Pattern.compile("\\b(20\\d{2}|19\\d{2})\\b");
        Matcher yearMatcher = yearPattern.matcher(durationStr);
        int firstYear = 0;
        int secondYear = 0;
        if (yearMatcher.find()) {
            firstYear = Integer.parseInt(yearMatcher.group(1));
        }
        if (yearMatcher.find()) {
            secondYear = Integer.parseInt(yearMatcher.group(1));
        }

        int lastYear = secondYear > 0 ? secondYear : firstYear;

        Pattern shortYearPattern = Pattern.compile("\\b\\d{2}\\b");
        Matcher shortYearMatcher = shortYearPattern.matcher(durationStr);
        int firstShortYear = 0;
        int secondShortYear = 0;
        if (shortYearMatcher.find()) {
            firstShortYear = Integer.parseInt(shortYearMatcher.group(0)) + 2000;
        }
        if (shortYearMatcher.find()) {
            secondShortYear = Integer.parseInt(shortYearMatcher.group(0)) + 2000;
        }

        int lastShortYear = secondShortYear > 0 ? secondShortYear : firstShortYear;

        endYear = lastYear > 0 ? lastYear : lastShortYear;

        List<String> months = Arrays.asList("jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec");
        int lastMonthPos = -1;
        for (int i = 0; i < months.size(); i++) {
            int pos = lower.lastIndexOf(months.get(i));
            if (pos != -1 && pos > lastMonthPos) {
                lastMonthPos = pos;
                endMonth = i + 1;
            }
        }

        return endYear * 100 + endMonth;
    }

    public Page<Project> getAllProjects(int page, int size, String sort, String search) {
        List<Project> projects;
        if (search != null && !search.isBlank()) {
            projects = projectRepository.searchProjectsList(search);
        } else {
            projects = projectRepository.findAll();
        }

        List<Project> sorted = projects.stream()
            .sorted((a, b) -> {
                int startA = getStartScore(a.getCreatedDate());
                int startB = getStartScore(b.getCreatedDate());
                if (startB != startA) {
                    return startB - startA;
                }
                int endA = getEndScore(a.getCreatedDate());
                int endB = getEndScore(b.getCreatedDate());
                return endB - endA;
            })
            .collect(Collectors.toList());

        int start = Math.min(page * size, sorted.size());
        int end = Math.min(start + size, sorted.size());
        List<Project> subList = sorted.subList(start, end);

        return new PageImpl<>(subList, PageRequest.of(page, size), sorted.size());
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
    }

    public Project createProject(ProjectDto dto) {
        Project project = Project.builder()
                .title(dto.getTitle())
                .shortDescription(dto.getShortDescription())
                .detailedDescription(dto.getDetailedDescription())
                .techStack(dto.getTechStack())
                .githubLink(dto.getGithubLink())
                .liveLink(dto.getLiveLink())
                .imageUrl(dto.getImageUrl())
                .createdDate(dto.getCreatedDate())
                .build();
        return projectRepository.save(project);
    }

    public Project updateProject(Long id, ProjectDto dto) {
        Project project = getProjectById(id);
        project.setTitle(dto.getTitle());
        project.setShortDescription(dto.getShortDescription());
        project.setDetailedDescription(dto.getDetailedDescription());
        project.setTechStack(dto.getTechStack());
        project.setGithubLink(dto.getGithubLink());
        project.setLiveLink(dto.getLiveLink());
        if (dto.getImageUrl() != null) project.setImageUrl(dto.getImageUrl());
        project.setCreatedDate(dto.getCreatedDate());
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        Project project = getProjectById(id);
        projectRepository.delete(project);
    }
}
