package com.codealpha.chatbot.service;

import com.codealpha.chatbot.dto.ConversationResponse;
import com.codealpha.chatbot.dto.MessageResponse;
import java.util.List;
import com.codealpha.chatbot.dto.ChatResponse;
import com.codealpha.chatbot.entity.Conversation;
import com.codealpha.chatbot.entity.Message;
import com.codealpha.chatbot.repository.ConversationRepository;
import com.codealpha.chatbot.repository.MessageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ChatbotService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final GeminiService geminiService;

    public ChatbotService(
            ConversationRepository conversationRepository,
            MessageRepository messageRepository,
            GeminiService geminiService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.geminiService = geminiService;
    }

    @Transactional
    public ChatResponse generateReply(Long conversationId, String message) {
        if (message == null || message.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Message must not be empty.");
        }

        String userMessage = message.trim();

        Conversation conversation;

        if (conversationId == null) {
            conversation = conversationRepository.save(
                    new Conversation(createTitle(userMessage)));
        } else {
            conversation = conversationRepository.findById(conversationId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Conversation not found: " + conversationId));
        }

        // Generate the AI reply before saving messages.
        String reply = geminiService.generateReply(userMessage);

        // Save messages only after Gemini returns a successful reply.
        messageRepository.save(
                new Message(conversation, userMessage, "user"));

        messageRepository.save(
                new Message(conversation, reply, "assistant"));

        return new ChatResponse(conversation.getId(), reply);
    }

    private String createTitle(String message) {
        String title = message.trim().replaceAll("\\s+", " ");

        if (title.length() > 50) {
            return title.substring(0, 47) + "...";
        }

        return title;
    }

    @Transactional(readOnly = true)
    public List<ConversationResponse> getAllConversations() {
        return conversationRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(conversation -> new ConversationResponse(
                        conversation.getId(),
                        conversation.getTitle(),
                        conversation.getCreatedAt()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getConversationMessages(Long conversationId) {
        if (!conversationRepository.existsById(conversationId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Conversation not found: " + conversationId);
        }

        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId)
                .stream()
                .map(message -> new MessageResponse(
                        message.getId(),
                        message.getContent(),
                        message.getSender(),
                        message.getCreatedAt()))
                .toList();
    }
}
