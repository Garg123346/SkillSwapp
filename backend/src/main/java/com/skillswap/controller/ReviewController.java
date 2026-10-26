package com.skillswap.controller;

import com.skillswap.dto.ReviewCreateDto;
import com.skillswap.dto.ReviewDto;
import com.skillswap.model.User;
import com.skillswap.service.AuthService;
import com.skillswap.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final AuthService authService;

    public ReviewController(ReviewService reviewService, AuthService authService) {
        this.reviewService = reviewService;
        this.authService = authService;
    }

    @GetMapping("/mentor/{mentorId}")
    public ResponseEntity<List<ReviewDto>> getMentorReviews(@PathVariable Long mentorId) {
        return ResponseEntity.ok(reviewService.getReviewsForMentor(mentorId));
    }

    @PostMapping
    public ResponseEntity<ReviewDto> addReview(@Valid @RequestBody ReviewCreateDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        ReviewDto created = reviewService.addReview(user, dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
