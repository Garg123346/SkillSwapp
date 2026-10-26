package com.skillswap.service;

import com.skillswap.dto.DashboardStatsDto;
import com.skillswap.dto.SessionRequestResponseDto;
import com.skillswap.dto.UserDto;
import com.skillswap.model.RequestStatus;
import com.skillswap.model.SessionRequest;
import com.skillswap.model.SkillCategory;
import com.skillswap.model.User;
import com.skillswap.repository.SessionRequestRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final SessionRequestService requestService;
    private final MentorService mentorService;
    private final SessionRequestRepository sessionRequestRepository;
    private final UserRepository userRepository;

    public DashboardService(SessionRequestService requestService,
                            MentorService mentorService,
                            SessionRequestRepository sessionRequestRepository,
                            UserRepository userRepository) {
        this.requestService = requestService;
        this.mentorService = mentorService;
        this.sessionRequestRepository = sessionRequestRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats(User currentUser) {
        DashboardStatsDto stats = new DashboardStatsDto();

        List<SessionRequestResponseDto> userRequests = requestService.getUserRequests(currentUser.getId());

        List<SessionRequestResponseDto> upcoming = userRequests.stream()
                .filter(r -> r.getStatus() == RequestStatus.Accepted || r.getStatus() == RequestStatus.Pending)
                .limit(4)
                .collect(Collectors.toList());

        List<SessionRequestResponseDto> pending = userRequests.stream()
                .filter(r -> r.getStatus() == RequestStatus.Pending)
                .collect(Collectors.toList());

        long completedCount = userRequests.stream()
                .filter(r -> r.getStatus() == RequestStatus.Completed)
                .count();

        stats.setUpcomingSessions(upcoming);
        stats.setUpcomingSessionsCount(upcoming.size());
        stats.setPendingRequests(pending);
        stats.setPendingRequestsCount(pending.size());
        stats.setCompletedSessionsCount((int) completedCount);
        stats.setCredits(currentUser.getCredits());

        // Calculate teaching and learning hours based on requests
        int totalHours = userRequests.size() * 2;
        stats.setLearningHours(Math.max(4, (int) (completedCount * 2 + 2)));
        stats.setTeachingHours(Math.max(2, (int) (currentUser.getSessionCount() * 2)));

        // Recommended mentors based on wanted skills
        UserDto profile = mentorService.mapToUserDto(currentUser);
        Set<SkillCategory> wantedCategories = profile.getWantsToLearn().stream()
                .map(s -> s.getCategory())
                .collect(Collectors.toSet());

        List<UserDto> allMentors = mentorService.getMentors(null, null, "rating", null);
        List<UserDto> recommended = allMentors.stream()
                .filter(m -> !m.getId().equals(String.valueOf(currentUser.getId())))
                .filter(m -> wantedCategories.isEmpty() || m.getTeaches().stream().anyMatch(t -> wantedCategories.contains(t.getCategory())))
                .limit(3)
                .collect(Collectors.toList());

        stats.setRecommendedMentors(recommended);

        return stats;
    }
}
