package com.skillswap.controller;

import com.skillswap.dto.CommunityPostCreateDto;
import com.skillswap.dto.CommunityPostDto;
import com.skillswap.model.User;
import com.skillswap.service.AuthService;
import com.skillswap.service.CommunityPostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class CommunityPostController {

    private final CommunityPostService postService;
    private final AuthService authService;

    public CommunityPostController(CommunityPostService postService, AuthService authService) {
        this.postService = postService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<CommunityPostDto>> getPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type) {
        User currentUser = null;
        try {
            currentUser = authService.getCurrentAuthenticatedUser();
        } catch (Exception ignored) {}

        List<CommunityPostDto> posts = postService.getAllPosts(currentUser, category, type);
        return ResponseEntity.ok(posts);
    }

    @PostMapping
    public ResponseEntity<CommunityPostDto> createPost(@Valid @RequestBody CommunityPostCreateDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        CommunityPostDto created = postService.createPost(user, dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        postService.deletePost(user, id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(postService.toggleLike(user, id));
    }

    @PostMapping("/{id}/bookmark")
    public ResponseEntity<Map<String, Object>> toggleBookmark(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(postService.toggleBookmark(user, id));
    }
}
