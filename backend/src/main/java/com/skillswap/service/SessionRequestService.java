package com.skillswap.service;

import com.skillswap.dto.SessionRequestCreateDto;
import com.skillswap.dto.SessionRequestResponseDto;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.exception.UnauthorizedException;
import com.skillswap.model.RequestStatus;
import com.skillswap.model.SessionRequest;
import com.skillswap.model.User;
import com.skillswap.repository.SessionRequestRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class SessionRequestService {

    private final SessionRequestRepository requestRepository;
    private final UserRepository userRepository;

    public SessionRequestService(SessionRequestRepository requestRepository,
                                 UserRepository userRepository) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public SessionRequestResponseDto createRequest(User currentUser, SessionRequestCreateDto dto) {
        if (currentUser.getId().equals(dto.getMentorId())) {
            throw new BadRequestException("You cannot request a mentoring session with yourself");
        }

        User mentor = userRepository.findById(dto.getMentorId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found with ID: " + dto.getMentorId()));

        // Prevent duplicate pending requests
        List<SessionRequest> existingPending = requestRepository.findByRequesterIdAndMentorIdAndStatus(
                currentUser.getId(), mentor.getId(), RequestStatus.Pending);
        if (!existingPending.isEmpty()) {
            throw new BadRequestException("You already have a pending session request with this mentor");
        }

        SessionRequest request = new SessionRequest(
                currentUser,
                mentor,
                dto.getSkillName().trim(),
                dto.getProposedDate() != null && !dto.getProposedDate().isBlank() ? dto.getProposedDate().trim() : "Upcoming Weekend",
                dto.getMessage() != null ? dto.getMessage().trim() : "Hi! I would love to learn " + dto.getSkillName() + " with you."
        );

        SessionRequest saved = requestRepository.save(request);
        return mapToDto(saved, currentUser.getId());
    }

    @Transactional(readOnly = true)
    public List<SessionRequestResponseDto> getUserRequests(Long userId) {
        List<SessionRequest> requests = requestRepository.findAllByUser(userId);
        return requests.stream()
                .map(r -> mapToDto(r, userId))
                .collect(Collectors.toList());
    }

    @Transactional
    public SessionRequestResponseDto updateRequestStatus(User currentUser, Long requestId, String statusStr) {
        SessionRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Session request not found with ID: " + requestId));

        RequestStatus newStatus = RequestStatus.fromString(statusStr);

        boolean isMentor = request.getMentor().getId().equals(currentUser.getId());
        boolean isRequester = request.getRequester().getId().equals(currentUser.getId());

        if (!isMentor && !isRequester) {
            throw new UnauthorizedException("You are not authorized to update this session request");
        }

        // Permissions logic
        if (newStatus == RequestStatus.Accepted || newStatus == RequestStatus.Rejected) {
            if (!isMentor) {
                throw new UnauthorizedException("Only the mentor can accept or reject session requests");
            }
        } else if (newStatus == RequestStatus.Cancelled) {
            if (!isRequester && !isMentor) {
                throw new UnauthorizedException("Only parties to this session can cancel it");
            }
        } else if (newStatus == RequestStatus.Completed) {
            // Either mentor or requester can mark complete
            if (request.getStatus() != RequestStatus.Accepted) {
                throw new BadRequestException("Only accepted sessions can be marked as completed");
            }
            // Increment session counts
            User mentor = request.getMentor();
            mentor.setSessionCount(mentor.getSessionCount() + 1);
            mentor.setCredits(mentor.getCredits() + 1);
            userRepository.save(mentor);

            User requester = request.getRequester();
            requester.setSessionCount(requester.getSessionCount() + 1);
            userRepository.save(requester);
        }

        request.setStatus(newStatus);
        SessionRequest saved = requestRepository.save(request);
        return mapToDto(saved, currentUser.getId());
    }

    private SessionRequestResponseDto mapToDto(SessionRequest r, Long currentUserId) {
        SessionRequestResponseDto dto = new SessionRequestResponseDto();
        dto.setId(String.valueOf(r.getId()));
        dto.setMentorId(String.valueOf(r.getMentor().getId()));
        dto.setMentorName(r.getMentor().getName());
        dto.setMentorAvatar(r.getMentor().getAvatarInitials());
        dto.setMentorUniversity(r.getMentor().getCollege());
        dto.setRequesterId(String.valueOf(r.getRequester().getId()));
        dto.setRequesterName(r.getRequester().getName());
        dto.setRequesterAvatar(r.getRequester().getAvatarInitials());
        dto.setSkillName(r.getSkillName());
        dto.setMessage(r.getLearningGoals());
        dto.setProposedDate(r.getPreferredDate());
        dto.setStatus(r.getStatus());

        if (r.getRequester().getId().equals(currentUserId)) {
            dto.setDirection("Sent");
        } else {
            dto.setDirection("Received");
        }

        if (r.getCreatedAt() != null) {
            dto.setCreatedAt(r.getCreatedAt().format(DateTimeFormatter.ofPattern("d MMMM yyyy", Locale.ENGLISH)));
        }

        return dto;
    }
}
