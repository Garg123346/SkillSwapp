package com.skillswap.dto;

import com.skillswap.model.RequestStatus;

public class SessionRequestResponseDto {
    private String id;
    private String mentorId;
    private String mentorName;
    private String mentorAvatar;
    private String mentorUniversity;
    private String requesterId;
    private String requesterName;
    private String requesterAvatar;
    private String skillName;
    private String message;
    private String proposedDate;
    private RequestStatus status;
    private String direction; // Sent or Received
    private String createdAt;

    public SessionRequestResponseDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMentorId() { return mentorId; }
    public void setMentorId(String mentorId) { this.mentorId = mentorId; }

    public String getMentorName() { return mentorName; }
    public void setMentorName(String mentorName) { this.mentorName = mentorName; }

    public String getMentorAvatar() { return mentorAvatar; }
    public void setMentorAvatar(String mentorAvatar) { this.mentorAvatar = mentorAvatar; }

    public String getMentorUniversity() { return mentorUniversity; }
    public void setMentorUniversity(String mentorUniversity) { this.mentorUniversity = mentorUniversity; }

    public String getRequesterId() { return requesterId; }
    public void setRequesterId(String requesterId) { this.requesterId = requesterId; }

    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }

    public String getRequesterAvatar() { return requesterAvatar; }
    public void setRequesterAvatar(String requesterAvatar) { this.requesterAvatar = requesterAvatar; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getProposedDate() { return proposedDate; }
    public void setProposedDate(String proposedDate) { this.proposedDate = proposedDate; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public String getDirection() { return direction; }
    public void setDirection(String direction) { this.direction = direction; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
