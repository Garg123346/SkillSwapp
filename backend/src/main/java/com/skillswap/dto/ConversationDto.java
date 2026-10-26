package com.skillswap.dto;

import java.util.ArrayList;
import java.util.List;

public class ConversationDto {
    private String id;
    private String participantId;
    private String participantName;
    private String participantInitials;
    private String participantUniversity;
    private String subject;
    private String lastActive;
    private int unreadCount;
    private List<MessageDto> messages = new ArrayList<>();

    public ConversationDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getParticipantId() { return participantId; }
    public void setParticipantId(String participantId) { this.participantId = participantId; }

    public String getParticipantName() { return participantName; }
    public void setParticipantName(String participantName) { this.participantName = participantName; }

    public String getParticipantInitials() { return participantInitials; }
    public void setParticipantInitials(String participantInitials) { this.participantInitials = participantInitials; }

    public String getParticipantUniversity() { return participantUniversity; }
    public void setParticipantUniversity(String participantUniversity) { this.participantUniversity = participantUniversity; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getLastActive() { return lastActive; }
    public void setLastActive(String lastActive) { this.lastActive = lastActive; }

    public int getUnreadCount() { return unreadCount; }
    public void setUnreadCount(int unreadCount) { this.unreadCount = unreadCount; }

    public List<MessageDto> getMessages() { return messages; }
    public void setMessages(List<MessageDto> messages) { this.messages = messages; }
}
