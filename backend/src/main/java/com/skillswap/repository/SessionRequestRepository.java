package com.skillswap.repository;

import com.skillswap.model.RequestStatus;
import com.skillswap.model.SessionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRequestRepository extends JpaRepository<SessionRequest, Long> {
    List<SessionRequest> findByRequesterIdOrderByCreatedAtDesc(Long requesterId);
    List<SessionRequest> findByMentorIdOrderByCreatedAtDesc(Long mentorId);
    
    @Query("SELECT r FROM SessionRequest r WHERE r.requester.id = :userId OR r.mentor.id = :userId ORDER BY r.createdAt DESC")
    List<SessionRequest> findAllByUser(@Param("userId") Long userId);

    List<SessionRequest> findByRequesterIdAndMentorIdAndStatus(Long requesterId, Long mentorId, RequestStatus status);
}
