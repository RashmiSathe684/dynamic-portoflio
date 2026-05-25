package com.rashmi.portfolio.service;

import com.rashmi.portfolio.entity.Education;
import com.rashmi.portfolio.repository.EducationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EducationService {
    private final EducationRepository educationRepository;

    public List<Education> getAllEducation() {
        return educationRepository.findAll();
    }

    public Education saveEducation(Education education) {
        return educationRepository.save(education);
    }

    public void deleteEducation(Long id) {
        educationRepository.deleteById(id);
    }
}
