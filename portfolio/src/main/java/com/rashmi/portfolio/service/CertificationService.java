package com.rashmi.portfolio.service;

import com.rashmi.portfolio.dto.CertificationDto;
import com.rashmi.portfolio.entity.Certification;
import com.rashmi.portfolio.exception.ResourceNotFoundException;
import com.rashmi.portfolio.repository.CertificationRepository;
import com.rashmi.portfolio.util.HtmlSanitizer;
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
                .title(HtmlSanitizer.sanitize(dto.getTitle()))
                .organization(HtmlSanitizer.sanitize(dto.getOrganization()))
                .description(HtmlSanitizer.sanitize(dto.getDescription()))
                .issueDate(dto.getIssueDate())
                .imageUrl(dto.getImageUrl())
                .certificateLink(dto.getCertificateLink())
                .build();
        return certificationRepository.save(c);
    }

    public Certification update(Long id, CertificationDto dto) {
        Certification c = getById(id);
        c.setTitle(HtmlSanitizer.sanitize(dto.getTitle()));
        c.setOrganization(HtmlSanitizer.sanitize(dto.getOrganization()));
        c.setDescription(HtmlSanitizer.sanitize(dto.getDescription()));
        c.setIssueDate(dto.getIssueDate());
        if (dto.getImageUrl() != null) c.setImageUrl(dto.getImageUrl());
        c.setCertificateLink(dto.getCertificateLink());
        return certificationRepository.save(c);
    }

    public void delete(Long id) {
        certificationRepository.delete(getById(id));
    }
}

