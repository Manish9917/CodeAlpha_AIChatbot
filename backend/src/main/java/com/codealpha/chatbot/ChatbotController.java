package com.codealpha.chatbot;

import com.codealpha.chatbot.dto.ChatRequest;
import com.codealpha.chatbot.dto.ChatResponse;
import com.codealpha.chatbot.service.ChatbotService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.codealpha.chatbot.dto.ConversationResponse;
import com.codealpha.chatbot.dto.MessageResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/api")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/chat")
    public ChatResponse chat(@Valid @RequestBody ChatRequest request) {
        return chatbotService.generateReply(
                request.conversationId(),
                request.message());
    }

        @GetMapping("/conversations")
    public List<ConversationResponse> getAllConversations() {
        return chatbotService.getAllConversations();
    }

    @GetMapping("/conversations/{id}/messages")
    public List<MessageResponse> getConversationMessages(
            @PathVariable Long id) {
        return chatbotService.getConversationMessages(id);
    }

}
