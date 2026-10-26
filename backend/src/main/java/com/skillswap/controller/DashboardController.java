package com.skillswap.controller;

import com.skillswap.dto.DashboardStatsDto;
import com.skillswap.model.User;
import com.skillswap.service.AuthService;
import com.skillswap.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthService authService;

    public DashboardController(DashboardService dashboardService, AuthService authService) {
        this.dashboardService = dashboardService;
        this.authService = authService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        User user = authService.getCurrentAuthenticatedUser();
        DashboardStatsDto stats = dashboardService.getDashboardStats(user);
        return ResponseEntity.ok(stats);
    }
}
