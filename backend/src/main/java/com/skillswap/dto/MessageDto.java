package com.skillswap.dto;

public class MessageDto {
    private String id;
    private String conversationId;
    private String sender; // "me" or "them"
    private String senderId;
    private String senderName;
    private String text;
    private String timestamp;
    private boolean read;

    public MessageDto() {}

    public MessageDto(String id, String conversationId, String sender, String senderId, String senderName, String text, String timestamp, boolean read) {
        this.id = id;
        this.conversationId = conversationId;
        this.sender = sender;
        this.senderId = senderId;
        this.senderName = senderName;
        this.text = text;
        this.timestamp = timestamp;
        this.read = read;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getConversationId() { return conversationId; }
    public void setConversationId(String conversationId) { this.conversationId = conversationId; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
}
