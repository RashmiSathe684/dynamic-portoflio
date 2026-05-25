package com.rashmi.portfolio.service;

import com.rashmi.portfolio.dto.AchievementDto;
import com.rashmi.portfolio.entity.Achievement;
import com.rashmi.portfolio.exception.ResourceNotFoundException;
import com.rashmi.portfolio.repository.AchievementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AchievementService {

    private final AchievementRepository achievementRepository;

    public Page<Achievement> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "achievementDate"));
        return achievementRepository.findAll(pageable);
    }

    public Achievement getById(Long id) {
        return achievementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Achievement not found: " + id));
    }

    public Achievement create(AchievementDto dto) {
        Achievement a = Achievement.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .achievementDate(dto.getAchievementDate())
                .imageUrl(dto.getImageUrl())
                .build();
        return achievementRepository.save(a);
    }

    public Achievement update(Long id, AchievementDto dto) {
        Achievement a = getById(id);
        a.setTitle(dto.getTitle());
        a.setDescription(dto.getDescription());
        a.setAchievementDate(dto.getAchievementDate());
        if (dto.getImageUrl() != null) a.setImageUrl(dto.getImageUrl());
        return achievementRepository.save(a);
    }

    public void delete(Long id) {
        achievementRepository.delete(getById(id));
    }
}
