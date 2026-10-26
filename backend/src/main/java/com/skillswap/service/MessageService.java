package com.skillswap.service;

import com.skillswap.dto.ConversationDto;
import com.skillswap.dto.MessageDto;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.model.Message;
import com.skillswap.model.User;
import com.skillswap.repository.MessageRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository,
                          UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ConversationDto> getUserConversations(User currentUser) {
        List<String> convIds = messageRepository.findConversationIdsByUser(currentUser.getId());
        List<ConversationDto> conversations = new ArrayList<>();

        for (String convId : convIds) {
            List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(convId);
            if (messages.isEmpty()) continue;

            Message lastMsg = messages.get(messages.size() - 1);
            User partner = lastMsg.getSender().getId().equals(currentUser.getId()) ? lastMsg.getReceiver() : lastMsg.getSender();

            ConversationDto dto = new ConversationDto();
            dto.setId(convId);
            dto.setParticipantId(String.valueOf(partner.getId()));
            dto.setParticipantName(partner.getName());
            dto.setParticipantInitials(partner.getAvatarInitials());
            dto.setParticipantUniversity(partner.getCollege() != null ? partner.getCollege() : "Campus");
            dto.setSubject("Skill Exchange Session");
            dto.setLastActive(lastMsg.getCreatedAt().format(DateTimeFormatter.ofPattern("HH:mm", Locale.ENGLISH)));

            long unread = messages.stream().filter(m -> m.getReceiver().getId().equals(currentUser.getId()) && !m.getRead()).count();
            dto.setUnreadCount((int) unread);

            List<MessageDto> msgDtos = messages.stream().map(m -> new MessageDto(
                    String.valueOf(m.getId()),
                    m.getConversationId(),
                    m.getSender().getId().equals(currentUser.getId()) ? "me" : "them",
                    String.valueOf(m.getSender().getId()),
                    m.getSender().getName(),
                    m.getContent(),
                    m.getCreatedAt().format(DateTimeFormatter.ofPattern("HH:mm", Locale.ENGLISH)),
                    m.getRead()
            )).collect(Collectors.toList());

            dto.setMessages(msgDtos);
            conversations.add(dto);
        }

        // Sort by last message time
        return conversations;
    }

    @Transactional(readOnly = true)
    public List<MessageDto> getConversationMessages(User currentUser, String convId) {
        List<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(convId);
        return messages.stream().map(m -> new MessageDto(
                String.valueOf(m.getId()),
                m.getConversationId(),
                m.getSender().getId().equals(currentUser.getId()) ? "me" : "them",
                String.valueOf(m.getSender().getId()),
                m.getSender().getName(),
                m.getContent(),
                m.getCreatedAt().format(DateTimeFormatter.ofPattern("HH:mm", Locale.ENGLISH)),
                m.getRead()
        )).collect(Collectors.toList());
    }

    @Transactional
    public MessageDto sendMessage(User currentUser, Long receiverId, String text) {
        if (currentUser.getId().equals(receiverId)) {
            throw new BadRequestException("You cannot send a message to yourself");
        }

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver user not found with ID: " + receiverId));

        Message message = new Message(currentUser, receiver, text.trim());
        Message saved = messageRepository.save(message);

        return new MessageDto(
                String.valueOf(saved.getId()),
                saved.getConversationId(),
                "me",
                String.valueOf(currentUser.getId()),
                currentUser.getName(),
                saved.getContent(),
                saved.getCreatedAt().format(DateTimeFormatter.ofPattern("HH:mm", Locale.ENGLISH)),
                true
        );
    }

    @Transactional
    public void markConversationRead(User currentUser, String convId) {
        messageRepository.markConversationAsRead(convId, currentUser.getId());
    }
}
