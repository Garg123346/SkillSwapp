package com.skillswap.controller;

import com.skillswap.dto.SessionRequestCreateDto;
import com.skillswap.dto.SessionRequestResponseDto;
import com.skillswap.model.User;
import com.skillswap.service.AuthService;
import com.skillswap.service.SessionRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
public class SessionRequestController {

    private final SessionRequestService requestService;
    private final AuthService authService;

    public SessionRequestController(SessionRequestService requestService, AuthService authService) {
        this.requestService = requestService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<SessionRequestResponseDto>> getMyRequests() {
        User user = authService.getCurrentAuthenticatedUser();
        List<SessionRequestResponseDto> requests = requestService.getUserRequests(user.getId());
        return ResponseEntity.ok(requests);
    }

    @PostMapping
    public ResponseEntity<SessionRequestResponseDto> createRequest(@Valid @RequestBody SessionRequestCreateDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        SessionRequestResponseDto response = requestService.createRequest(user, dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SessionRequestResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        User user = authService.getCurrentAuthenticatedUser();
        String status = statusUpdate.get("status");
        SessionRequestResponseDto response = requestService.updateRequestStatus(user, id, status);
        return ResponseEntity.ok(response);
    }
}
