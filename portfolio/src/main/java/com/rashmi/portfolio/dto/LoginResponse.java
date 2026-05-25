package com.rashmi.portfolio.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String username;
    private String message;
}