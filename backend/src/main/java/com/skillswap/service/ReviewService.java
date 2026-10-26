package com.skillswap.service;

import com.skillswap.dto.ReviewCreateDto;
import com.skillswap.dto.ReviewDto;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.model.Review;
import com.skillswap.model.SessionRequest;
import com.skillswap.model.User;
import com.skillswap.repository.ReviewRepository;
import com.skillswap.repository.SessionRequestRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final SessionRequestRepository sessionRequestRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         UserRepository userRepository,
                         SessionRequestRepository sessionRequestRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.sessionRequestRepository = sessionRequestRepository;
    }

    @Transactional
    public ReviewDto addReview(User currentUser, ReviewCreateDto dto) {
        if (currentUser.getId().equals(dto.getMentorId())) {
            throw new BadRequestException("You cannot write a review for yourself");
        }

        User mentor = userRepository.findById(dto.getMentorId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with ID: " + dto.getMentorId()));

        SessionRequest session = null;
        if (dto.getSessionRequestId() != null) {
            session = sessionRequestRepository.findById(dto.getSessionRequestId()).orElse(null);
        }

        Review review = new Review(currentUser, mentor, session, dto.getRating(), dto.getComment().trim());
        Review saved = reviewRepository.save(review);

        // Recalculate mentor rating
        Double avg = reviewRepository.getAverageRatingByMentorId(mentor.getId());
        Long count = reviewRepository.countReviewsByMentorId(mentor.getId());
        mentor.setRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 5.0);
        mentor.setReviewCount(count != null ? count.intValue() : 0);
        userRepository.save(mentor);

        return new ReviewDto(
                String.valueOf(saved.getId()),
                currentUser.getName(),
                currentUser.getCollege() != null ? currentUser.getCollege() : "Campus",
                currentUser.getAvatarInitials(),
                saved.getRating(),
                saved.getComment(),
                saved.getCreatedAt().format(DateTimeFormatter.ofPattern("d MMMM yyyy", Locale.ENGLISH))
        );
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> getReviewsForMentor(Long mentorId) {
        return reviewRepository.findByMentorIdOrderByCreatedAtDesc(mentorId).stream().map(r -> new ReviewDto(
                String.valueOf(r.getId()),
                r.getReviewer().getName(),
                r.getReviewer().getCollege() != null ? r.getReviewer().getCollege() : "Campus",
                r.getReviewer().getAvatarInitials(),
                r.getRating(),
                r.getComment(),
                r.getCreatedAt().format(DateTimeFormatter.ofPattern("d MMMM yyyy", Locale.ENGLISH))
        )).collect(Collectors.toList());
    }
}
