package com.skillswap.controller;

import com.skillswap.dto.ConversationDto;
import com.skillswap.dto.MessageDto;
import com.skillswap.model.User;
import com.skillswap.service.AuthService;
import com.skillswap.service.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MessageController {

    private final MessageService messageService;
    private final AuthService authService;

    public MessageController(MessageService messageService, AuthService authService) {
        this.messageService = messageService;
        this.authService = authService;
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> getConversations() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(messageService.getUserConversations(user));
    }

    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(@PathVariable String id) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(messageService.getConversationMessages(user, id));
    }

    @PostMapping("/messages")
    public ResponseEntity<MessageDto> sendMessage(@RequestBody Map<String, Object> body) {
        User user = authService.getCurrentAuthenticatedUser();
        Long receiverId = Long.valueOf(body.get("receiverId").toString());
        String text = body.get("text").toString();
        MessageDto sent = messageService.sendMessage(user, receiverId, text);
        return new ResponseEntity<>(sent, HttpStatus.CREATED);
    }

    @PostMapping("/conversations/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String id) {
        User user = authService.getCurrentAuthenticatedUser();
        messageService.markConversationRead(user, id);
        return ResponseEntity.ok().build();
    }
}
