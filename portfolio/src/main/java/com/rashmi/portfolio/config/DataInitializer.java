package com.rashmi.portfolio.config;

import com.rashmi.portfolio.entity.AdminUser;
import com.rashmi.portfolio.entity.Project;
import com.rashmi.portfolio.repository.AdminUserRepository;
import com.rashmi.portfolio.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final ProjectRepository projectRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Enforce Admin credentials
        var adminOpt = adminUserRepository.findByUsername("rashmi_admin");
        if (adminOpt.isEmpty()) {
            AdminUser admin = AdminUser.builder()
                    .username("rashmi_admin")
                    .password(passwordEncoder.encode("Admin@1234"))
                    .email("rashmisathe684@gmail.com")
                    .build();
            adminUserRepository.save(admin);
            System.out.println("✅ Admin user created: username=rashmi_admin, password=Admin@1234");
        } else {
            AdminUser admin = adminOpt.get();
            admin.setPassword(passwordEncoder.encode("Admin@1234"));
            adminUserRepository.save(admin);
            System.out.println("✅ Admin user password synchronized successfully!");
        }

        // Restore 4 original projects if database is empty or has only the test sample project
        long projectCount = projectRepository.count();
        boolean hasSample = projectRepository.findAll().stream()
                .anyMatch(p -> p.getTitle().equalsIgnoreCase("Sample Project") || p.getTitle().contains("Sample"));

        if (projectCount <= 1 || hasSample) {
            projectRepository.deleteAll();
            System.out.println("🔄 Wiping stale or sample projects and seeding the 4 original projects...");

            // 1. Campus Sync
            Project campusSync = Project.builder()
                    .title("Campus Sync – Campus Attendance Management System")
                    .shortDescription("Full-stack campus management platform with role-based portals for Admins and Faculty — featuring secure JWT auth, student/subject management, and a daily attendance ledger with history queries.")
                    .detailedDescription("Campus Sync is a web-based campus management platform built to streamline administrative and academic operations through role-specific portals.\n\nAdmins can manage users, enrolled students, and academic subjects. Faculty members can log daily attendance and query attendance history filtered by Faculty, Subject, and Date.\n\nAuthentication uses stateless JWT — the React frontend stores the token in local storage and an Axios interceptor automatically appends it as a Bearer token to every API call. The Spring Boot backend validates each request through a JwtRequestFilter chain, authorizing access based on user roles.\n\nDatabase entities are managed through Spring Data JPA (Hibernate) on MySQL, with no raw SQL needed for standard operations. The UI is built with React 19, Vite 7, and Tailwind CSS v4 for a fast, responsive dashboard experience.\n\nBuilt as the live training project at Kiran Academy, Pune — part of a 6-month integrated placement-linked full stack Java program.")
                    .techStack("Spring Boot, Java 17, React.js 19, Vite 7, MySQL, Spring Security, JWT, Spring Data JPA, Hibernate, Tailwind CSS 4, Axios, React Router DOM 7, REST APIs")
                    .githubLink("https://github.com/RashmiSathe684/Campus-Sync")
                    .liveLink("https://campus-sync-hub.vercel.app/")
                    .imageUrl("https://res.cloudinary.com/dsjkv1i54/image/upload/v1781433351/portfolio/projects/qfpmdaauaznf3ctqcijy.png")
                    .createdDate("Jun 2026 - Present")
                    .build();

            // 2. Dynamic Full-Stack Portfolio
            Project portfolioApp = Project.builder()
                    .title("Dynamic Full-Stack Portfolio Application")
                    .shortDescription("Full-stack dynamic portfolio site with a secure admin dashboard for real-time content management without redeployment.")
                    .detailedDescription("Built a complete full-stack portfolio website with a Spring Boot backend and React.js frontend. Features a JWT-secured admin dashboard to manage profile photo, resume, projects, and certifications dynamically. Images are stored via Cloudinary. Data is persisted in PostgreSQL with Hibernate ORM. No redeployment needed to update content.")
                    .techStack("Spring Boot, React.js, PostgreSQL, Spring Security, JWT, Hibernate, Cloudinary, Tailwind CSS, REST APIs")
                    .githubLink("https://github.com/RashmiSathe684/dynamic-portoflio")
                    .liveLink("https://rashmi-sathe-dynamic-portfolio.vercel.app/")
                    .imageUrl("https://res.cloudinary.com/dsjkv1i54/image/upload/v1781871128/portfolio/projects/j72er8rlrrjagxnjot4g.png")
                    .createdDate("Apr  2026 - May 2026")
                    .build();

            // 3. Blockchain-Based Blue Carbon
            Project carbonProject = Project.builder()
                    .title("Blockchain-Based Blue Carbon Registry & MRV System")
                    .shortDescription("SIH 2025 — AI/ML powered carbon credit issuance with blockchain verification, interactive Leaflet maps, and TensorFlow.")
                    .detailedDescription("Built for Smart India Hackathon 2025. A decentralized platform to automate and secure blue carbon offset projects. Coordinated workflows between NGOs, verifiers, and admins for transparent carbon credit tracking using Solidity smart contracts on Ganache. React frontend with Tailwind CSS, Django REST backend, Dockerized deployment, and PostgreSQL database.")
                    .techStack("React, TensorFlow, Solidity, AWS, Tailwind CSS, Django, REST APIs, Docker, Ganache, PostgreSQL")
                    .githubLink("https://github.com/Ghanasham2004/BlueCarbonMRV")
                    .liveLink("https://bluecarbonmrv.vercel.app/")
                    .imageUrl("https://res.cloudinary.com/dsjkv1i54/image/upload/v1781871201/portfolio/projects/ialbrbj6zjoycsavngsj.png")
                    .createdDate("Aug 2025 – May 2026")
                    .build();

            // 4. AI GD Helper Buddy
            Project gdBuddy = Project.builder()
                    .title("AI GD Helper Buddy – Your Personal GD Coach")
                    .shortDescription("AI-powered platform for real-time group discussion practice with automated feedback and communication analytics.")
                    .detailedDescription("Developed an AI-powered web application to help users practice group discussions with real-time feedback. Integrated Google Gemini API for intelligent coaching. Built with React and TypeScript for a smooth UI, Firebase for authentication and data storage, and Tailwind CSS for styling. Helps users improve communication and presentation skills before actual GD rounds.")
                    .techStack("React, TypeScript, Tailwind CSS, Firebase, Google Gemini API")
                    .githubLink("https://github.com/RashmiSathe684/ai_gd_buddy")
                    .liveLink("https://ai-gd-buddy.vercel.app/")
                    .imageUrl("https://res.cloudinary.com/dsjkv1i54/image/upload/v1781897380/portfolio/projects/qwrkwrqgqgnygm7dbgkz.png")
                    .createdDate("Mar 2025 – Jul 2025")
                    .build();

            projectRepository.save(campusSync);
            projectRepository.save(portfolioApp);
            projectRepository.save(carbonProject);
            projectRepository.save(gdBuddy);
            System.out.println("✅ All 4 original projects successfully seeded/restored!");
        }
    }
}
