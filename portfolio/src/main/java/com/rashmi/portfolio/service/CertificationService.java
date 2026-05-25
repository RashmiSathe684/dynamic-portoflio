package com.rashmi.portfolio.service;

import com.rashmi.portfolio.dto.CertificationDto;
import com.rashmi.portfolio.entity.Certification;
import com.rashmi.portfolio.exception.ResourceNotFoundException;
import com.rashmi.portfolio.repository.CertificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository certificationRepository;

    public Page<Certification> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "issueDate"));
        return certificationRepository.findAll(pageable);
    }

    public Certification getById(Long id) {
        return certificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found: " + id));
    }

    public Certification create(CertificationDto dto) {
        Certification c = Certification.builder()
                .title(dto.getTitle())
                .organization(dto.getOrganization())
                .description(dto.getDescription())
                .issueDate(dto.getIssueDate())
                .imageUrl(dto.getImageUrl())
                .certificateLink(dto.getCertificateLink())
                .build();
        return certificationRepository.save(c);
    }

    public Certification update(Long id, CertificationDto dto) {
        Certification c = getById(id);
        c.setTitle(dto.getTitle());
        c.setOrganization(dto.getOrganization());
        c.setDescription(dto.getDescription());
        c.setIssueDate(dto.getIssueDate());
        if (dto.getImageUrl() != null) c.setImageUrl(dto.getImageUrl());
        c.setCertificateLink(dto.getCertificateLink());
        return certificationRepository.save(c);
    }

    public void delete(Long id) {
        certificationRepository.delete(getById(id));
    }
}

