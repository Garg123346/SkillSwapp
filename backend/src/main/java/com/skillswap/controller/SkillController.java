package com.skillswap.controller;

import com.skillswap.dto.SkillDto;
import com.skillswap.dto.UserSkillRequest;
import com.skillswap.model.SkillCategory;
import com.skillswap.model.SkillType;
import com.skillswap.model.User;
import com.skillswap.service.AuthService;
import com.skillswap.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;
    private final AuthService authService;

    public SkillController(SkillService skillService, AuthService authService) {
        this.skillService = skillService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<SkillDto>> getAllSkills(@RequestParam(required = false) String category) {
        if (category != null && !category.isBlank() && !category.equalsIgnoreCase("Tous")) {
            try {
                SkillCategory cat = SkillCategory.fromString(category);
                return ResponseEntity.ok(skillService.getSkillsByCategory(cat));
            } catch (Exception ignored) {}
        }
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @PostMapping
    public ResponseEntity<SkillDto> createSkill(@Valid @RequestBody SkillDto dto) {
        SkillDto created = skillService.createSkill(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/user")
    public ResponseEntity<List<SkillDto>> getUserSkills(@RequestParam(defaultValue = "OFFERED") String type) {
        User user = authService.getCurrentAuthenticatedUser();
        SkillType skillType = "WANTED".equalsIgnoreCase(type) ? SkillType.WANTED : SkillType.OFFERED;
        return ResponseEntity.ok(skillService.getUserSkills(user.getId(), skillType));
    }

    @PostMapping("/user")
    public ResponseEntity<SkillDto> addUserSkill(@Valid @RequestBody UserSkillRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        SkillDto result = skillService.addUserSkill(user, request);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/user/{skillId}")
    public ResponseEntity<Void> removeUserSkill(@PathVariable Long skillId, @RequestParam(defaultValue = "OFFERED") String type) {
        User user = authService.getCurrentAuthenticatedUser();
        SkillType skillType = "WANTED".equalsIgnoreCase(type) ? SkillType.WANTED : SkillType.OFFERED;
        skillService.removeUserSkill(user, skillId, skillType);
        return ResponseEntity.noContent().build();
    }
}
