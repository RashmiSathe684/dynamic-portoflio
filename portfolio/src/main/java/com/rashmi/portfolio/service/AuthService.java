package com.rashmi.portfolio.service;

import com.rashmi.portfolio.dto.LoginRequest;
import com.rashmi.portfolio.dto.LoginResponse;
import com.rashmi.portfolio.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(), request.getPassword()));
        String token = jwtUtil.generateToken(request.getUsername());
        return new LoginResponse(token, request.getUsername(), "Login successful");
    }
}

