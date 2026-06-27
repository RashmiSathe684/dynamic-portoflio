package com.rashmi.portfolio;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rashmi.portfolio.dto.ProjectDto;
import com.rashmi.portfolio.entity.AdminUser;
import com.rashmi.portfolio.entity.Project;
import com.rashmi.portfolio.repository.AdminUserRepository;
import com.rashmi.portfolio.repository.ProjectRepository;
import com.rashmi.portfolio.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    private String adminToken;

    @BeforeEach
    public void setup() {
        projectRepository.deleteAll();
        adminUserRepository.deleteAll();

        // Register Admin
        AdminUser admin = AdminUser.builder()
                .username("testadmin")
                .password(passwordEncoder.encode("testpassword"))
                .email("testadmin@example.com")
                .build();
        adminUserRepository.save(admin);

        // Generate JWT
        adminToken = jwtUtil.generateToken("testadmin");

        // Seed a Project
        Project project = Project.builder()
                .title("Sample Project")
                .shortDescription("Short Description")
                .detailedDescription("Detailed Description")
                .techStack("Java, Spring")
                .githubLink("https://github.com/rashmi/sample")
                .liveLink("https://sample.vercel.app")
                .imageUrl("https://cloudinary.com/sample.jpg")
                .createdDate("Jun 2026 - Present")
                .build();
        projectRepository.save(project);
    }

    @Test
    public void testGetProjectsPublic() throws Exception {
        mockMvc.perform(get("/api/projects")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Sample Project"));
    }

    @Test
    public void testCreateProjectWithoutToken() throws Exception {
        ProjectDto dto = new ProjectDto();
        dto.setTitle("Unauthorized Project");

        mockMvc.perform(post("/api/projects")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testCreateProjectSuccess() throws Exception {
        ProjectDto dto = new ProjectDto();
        dto.setTitle("New Project");
        dto.setShortDescription("New short desc");
        dto.setDetailedDescription("New detailed desc");
        dto.setTechStack("React, Node");
        dto.setGithubLink("https://github.com/rashmi/new");
        dto.setLiveLink("https://new.vercel.app");
        dto.setImageUrl("https://cloudinary.com/new.jpg");
        dto.setCreatedDate("Jun 2026");

        mockMvc.perform(post("/api/projects")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("New Project"));
    }

    @Test
    public void testCreateProjectValidationFailure() throws Exception {
        ProjectDto dto = new ProjectDto();
        // Title blank -> should fail
        dto.setTitle(""); 
        dto.setGithubLink("invalid-url-format"); // invalid URL format -> should fail

        mockMvc.perform(post("/api/projects")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").exists())
                .andExpect(jsonPath("$.githubLink").exists());
    }
}
