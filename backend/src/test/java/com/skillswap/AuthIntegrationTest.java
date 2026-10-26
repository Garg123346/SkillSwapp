package com.skillswap;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillswap.dto.AuthRequest;
import com.skillswap.dto.RegisterRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Should successfully authenticate existing demo user and return JWT token")
    void testLoginSuccess() throws Exception {
        AuthRequest loginRequest = new AuthRequest("camille.laurent@harvard.edu", "SkillSwap2026");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.user.email").value("camille.laurent@harvard.edu"));
    }

    @Test
    @DisplayName("Should reject login with invalid password")
    void testLoginFailure() throws Exception {
        AuthRequest loginRequest = new AuthRequest("camille.laurent@harvard.edu", "WrongPassword123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should successfully register a new student account")
    void testRegisterSuccess() throws Exception {
        String uniqueEmail = "student." + System.currentTimeMillis() + "@testuniversity.edu";
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Aarav Patel");
        registerRequest.setEmail(uniqueEmail);
        registerRequest.setPassword("SecretPass2026");
        registerRequest.setCollege("IIT Delhi");
        registerRequest.setDepartment("Computer Engineering");
        registerRequest.setStudyYear("2nd Year");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.user.name").value("Aarav Patel"))
                .andExpect(jsonPath("$.user.email").value(uniqueEmail));
    }

    @Test
    @DisplayName("Should deny access to protected requests endpoint when token is missing")
    void testProtectedEndpointUnauthorized() throws Exception {
        mockMvc.perform(get("/api/requests"))
                .andExpect(status().isForbidden());
    }
}
