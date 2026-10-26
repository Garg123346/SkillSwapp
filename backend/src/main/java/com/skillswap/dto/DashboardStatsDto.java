package com.skillswap.dto;

import java.util.ArrayList;
import java.util.List;

public class DashboardStatsDto {
    private int upcomingSessionsCount;
    private int learningHours;
    private int teachingHours;
    private int credits;
    private int completedSessionsCount;
    private int pendingRequestsCount;
    private List<SessionRequestResponseDto> upcomingSessions = new ArrayList<>();
    private List<SessionRequestResponseDto> pendingRequests = new ArrayList<>();
    private List<UserDto> recommendedMentors = new ArrayList<>();

    public DashboardStatsDto() {}

    public int getUpcomingSessionsCount() { return upcomingSessionsCount; }
    public void setUpcomingSessionsCount(int upcomingSessionsCount) { this.upcomingSessionsCount = upcomingSessionsCount; }

    public int getLearningHours() { return learningHours; }
    public void setLearningHours(int learningHours) { this.learningHours = learningHours; }

    public int getTeachingHours() { return teachingHours; }
    public void setTeachingHours(int teachingHours) { this.teachingHours = teachingHours; }

    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }

    public int getCompletedSessionsCount() { return completedSessionsCount; }
    public void setCompletedSessionsCount(int completedSessionsCount) { this.completedSessionsCount = completedSessionsCount; }

    public int getPendingRequestsCount() { return pendingRequestsCount; }
    public void setPendingRequestsCount(int pendingRequestsCount) { this.pendingRequestsCount = pendingRequestsCount; }

    public List<SessionRequestResponseDto> getUpcomingSessions() { return upcomingSessions; }
    public void setUpcomingSessions(List<SessionRequestResponseDto> upcomingSessions) { this.upcomingSessions = upcomingSessions; }

    public List<SessionRequestResponseDto> getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(List<SessionRequestResponseDto> pendingRequests) { this.pendingRequests = pendingRequests; }

    public List<UserDto> getRecommendedMentors() { return recommendedMentors; }
    public void setRecommendedMentors(List<UserDto> recommendedMentors) { this.recommendedMentors = recommendedMentors; }
}
