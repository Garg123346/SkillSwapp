package com.skillswap.repository;

import com.skillswap.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMentorIdOrderByCreatedAtDesc(Long mentorId);
    List<Review> findByReviewerIdOrderByCreatedAtDesc(Long reviewerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.mentor.id = :mentorId")
    Double getAverageRatingByMentorId(@Param("mentorId") Long mentorId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.mentor.id = :mentorId")
    Long countReviewsByMentorId(@Param("mentorId") Long mentorId);
}
