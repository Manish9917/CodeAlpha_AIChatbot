package com.codealpha.chatbot.service;

import com.codealpha.chatbot.dto.ConversationResponse;
import com.codealpha.chatbot.dto.MessageResponse;
import com.codealpha.chatbot.dto.ChatResponse;
import com.codealpha.chatbot.entity.Conversation;
import com.codealpha.chatbot.entity.Message;
import com.codealpha.chatbot.entity.User;
import com.codealpha.chatbot.repository.ConversationRepository;
import com.codealpha.chatbot.repository.MessageRepository;
import com.codealpha.chatbot.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ChatbotService {

        private final ConversationRepository conversationRepository;
        private final MessageRepository messageRepository;
        private final UserRepository userRepository;
        private final GeminiService geminiService;

        public ChatbotService(
                        ConversationRepository conversationRepository,
                        MessageRepository messageRepository,
                        UserRepository userRepository,
                        GeminiService geminiService) {

                this.conversationRepository = conversationRepository;
                this.messageRepository = messageRepository;
                this.userRepository = userRepository;
                this.geminiService = geminiService;
        }

        private User getAuthenticatedUser() {

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                if (authentication == null
                                || !authentication.isAuthenticated()
                                || authentication.getName() == null) {

                        throw new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Please log in to continue.");
                }

                return userRepository.findByEmail(authentication.getName())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.UNAUTHORIZED,
                                                "User account not found."));
        }

        @Transactional
        public ChatResponse generateReply(Long conversationId, String message) {

                if (message == null || message.isBlank()) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Message must not be empty.");
                }

                User currentUser = getAuthenticatedUser();
                String userMessage = message.trim();

                Conversation conversation;

                if (conversationId == null) {

                        conversation = conversationRepository.save(
                                        new Conversation(createTitle(userMessage), currentUser));

                } else {

                        conversation = conversationRepository
                                        .findByIdAndUser_Id(conversationId, currentUser.getId())
                                        .orElseThrow(() -> new ResponseStatusException(
                                                        HttpStatus.NOT_FOUND,
                                                        "Conversation not found."));
                }

                String reply = geminiService.generateReply(userMessage);

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

                User currentUser = getAuthenticatedUser();

                return conversationRepository
                                .findAllByUser_IdOrderByCreatedAtDesc(currentUser.getId())
                                .stream()
                                .map(conversation -> new ConversationResponse(
                                                conversation.getId(),
                                                conversation.getTitle(),
                                                conversation.getCreatedAt()))
                                .toList();
        }

        @Transactional(readOnly = true)
        public List<MessageResponse> getConversationMessages(Long conversationId) {

                User currentUser = getAuthenticatedUser();

                Conversation conversation = conversationRepository
                                .findByIdAndUser_Id(conversationId, currentUser.getId())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Conversation not found."));

                return messageRepository
                                .findByConversationIdOrderByCreatedAtAsc(conversation.getId())
                                .stream()
                                .map(message -> new MessageResponse(
                                                message.getId(),
                                                message.getContent(),
                                                message.getSender(),
                                                message.getCreatedAt()))
                                .toList();
        }

        @Transactional
        public void deleteConversation(Long conversationId) {

                User currentUser = getAuthenticatedUser();

                Conversation conversation = conversationRepository
                                .findByIdAndUser_Id(conversationId, currentUser.getId())
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Conversation not found."));

                // Delete all messages belonging to this conversation first.
                messageRepository.deleteByConversation_Id(conversation.getId());

                // Delete the conversation after deleting its messages.
                conversationRepository.delete(conversation);
        }
}
