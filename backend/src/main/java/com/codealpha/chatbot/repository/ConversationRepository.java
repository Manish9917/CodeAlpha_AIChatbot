package com.codealpha.chatbot.repository;

import com.codealpha.chatbot.entity.Conversation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository
        extends JpaRepository<Conversation, Long> {

    // Get conversations belonging to a particular user.
    List<Conversation> findAllByUser_IdOrderByCreatedAtDesc(Long userId);

    // Find a conversation only if it belongs to the specified user.
    Optional<Conversation> findByIdAndUser_Id(Long id, Long userId);

    // Check whether a conversation belongs to the specified user.
    boolean existsByIdAndUser_Id(Long id, Long userId);
}
