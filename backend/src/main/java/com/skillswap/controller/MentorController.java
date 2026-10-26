package com.skillswap.controller;

import com.skillswap.dto.UserDto;
import com.skillswap.service.MentorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentors")
public class MentorController {

    private final MentorService mentorService;

    public MentorController(MentorService mentorService) {
        this.mentorService = mentorService;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getMentors(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) String q) {
        List<UserDto> mentors = mentorService.getMentors(category, level, sort, q);
        return ResponseEntity.ok(mentors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getMentorById(@PathVariable Long id) {
        UserDto mentor = mentorService.getMentorById(id);
        return ResponseEntity.ok(mentor);
    }
}
