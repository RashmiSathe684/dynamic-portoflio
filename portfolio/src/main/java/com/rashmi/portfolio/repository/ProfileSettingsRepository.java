package com.rashmi.portfolio.repository;

import com.rashmi.portfolio.entity.ProfileSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileSettingsRepository extends JpaRepository<ProfileSettings, Long> {
}
