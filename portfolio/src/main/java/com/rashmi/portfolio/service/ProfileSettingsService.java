package com.rashmi.portfolio.service;

import com.rashmi.portfolio.entity.ProfileSettings;
import com.rashmi.portfolio.repository.ProfileSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileSettingsService {
    private final ProfileSettingsRepository repository;

    public ProfileSettings getSettings() {
        return repository.findAll().stream().findFirst().orElseGet(() -> {
            ProfileSettings settings = new ProfileSettings();
            return repository.save(settings);
        });
    }

    public ProfileSettings updateSettings(ProfileSettings settings) {
        ProfileSettings existing = getSettings();
        if (settings.getProfilePhotoUrl() != null) existing.setProfilePhotoUrl(settings.getProfilePhotoUrl());
        if (settings.getResumeUrl() != null) existing.setResumeUrl(settings.getResumeUrl());
        return repository.save(existing);
    }
}
