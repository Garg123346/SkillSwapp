package com.skillswap;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillswap.config.JwtTokenProvider;
import com.skillswap.dto.SessionRequestCreateDto;
import com.skillswap.model.User;
import com.skillswap.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SessionRequestTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Should successfully retrieve user session requests with JWT token")
    void testGetRequestsWithAuth() throws Exception {
        String token = jwtTokenProvider.generateTokenFromEmail("camille.laurent@harvard.edu");

        mockMvc.perform(get("/api/requests")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("Should successfully create a new session request with another mentor")
    void testCreateSessionRequest() throws Exception {
        User alex = userRepository.findByEmail("alex.mercier@design.edu").orElseThrow();
        String token = jwtTokenProvider.generateTokenFromEmail("camille.laurent@harvard.edu");

        SessionRequestCreateDto createDto = new SessionRequestCreateDto();
        createDto.setMentorId(alex.getId());
        createDto.setSkillName("Advanced Figma Auto-Layout");
        createDto.setProposedDate("Next Saturday, 5 PM");
        createDto.setMessage("Would love guidance on responsive layout grids and token variables.");

        mockMvc.perform(post("/api/requests")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.skillName").value("Advanced Figma Auto-Layout"))
                .andExpect(jsonPath("$.status").value("Pending"));
    }

    @Test
    @DisplayName("Should reject session request with oneself")
    void testCreateSessionRequestWithSelf() throws Exception {
        User camille = userRepository.findByEmail("camille.laurent@harvard.edu").orElseThrow();
        String token = jwtTokenProvider.generateTokenFromEmail("camille.laurent@harvard.edu");

        SessionRequestCreateDto createDto = new SessionRequestCreateDto();
        createDto.setMentorId(camille.getId());
        createDto.setSkillName("Self Tutoring");

        mockMvc.perform(post("/api/requests")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isBadRequest());
    }
}
