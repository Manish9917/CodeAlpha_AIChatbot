package com.codealpha.chatbot.dto;

public record ChatResponse(
        Long conversationId,
        String reply
) {
}
