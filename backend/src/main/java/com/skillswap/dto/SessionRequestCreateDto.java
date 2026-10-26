package com.skillswap.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SessionRequestCreateDto {
    @NotNull(message = "Mentor ID is required")
    private Long mentorId;

    @NotBlank(message = "Skill name is required")
    private String skillName;

    private String proposedDate;
    private String message;

    public SessionRequestCreateDto() {}

    public Long getMentorId() { return mentorId; }
    public void setMentorId(Long mentorId) { this.mentorId = mentorId; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getProposedDate() { return proposedDate; }
    public void setProposedDate(String proposedDate) { this.proposedDate = proposedDate; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
