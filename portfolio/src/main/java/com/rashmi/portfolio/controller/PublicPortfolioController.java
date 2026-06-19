package com.rashmi.portfolio.controller;

import com.rashmi.portfolio.dto.PortfolioDetailsDto;
import com.rashmi.portfolio.service.PortfolioDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public/portfolio")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PublicPortfolioController {

    private final PortfolioDetailsService portfolioDetailsService;

    @GetMapping
    public ResponseEntity<PortfolioDetailsDto> getPortfolioDetails() {
        return ResponseEntity.ok(portfolioDetailsService.getPortfolioDetails());
    }
}
