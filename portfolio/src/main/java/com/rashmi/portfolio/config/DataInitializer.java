package com.rashmi.portfolio.config;

import com.rashmi.portfolio.entity.AdminUser;
import com.rashmi.portfolio.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create admin only if not exists
        if (adminUserRepository.findByUsername("rashmi_admin").isEmpty()) {
            AdminUser admin = AdminUser.builder()
                    .username("rashmi_admin")
                    .password(passwordEncoder.encode("Admin@1234"))
                    .email("rashmisathe684@gmail.com")
                    .build();
            adminUserRepository.save(admin);
            System.out.println("✅ Admin user created: username=rashmi_admin, password=Admin@1234");
        }
    }
}

