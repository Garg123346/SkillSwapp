package com.skillswap.repository;

import com.skillswap.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationIdOrderByCreatedAtAsc(String conversationId);
    
    @Query("SELECT DISTINCT m.conversationId FROM Message m WHERE m.sender.id = :userId OR m.receiver.id = :userId")
    List<String> findConversationIdsByUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver.id = :userId AND m.read = false")
    long countUnreadMessagesByUser(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Message m SET m.read = true WHERE m.conversationId = :conversationId AND m.receiver.id = :userId")
    void markConversationAsRead(@Param("conversationId") String conversationId, @Param("userId") Long userId);
}
