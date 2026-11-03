package com.codealpha.chatbot.dto;

import java.time.LocalDateTime;

public record MessageResponse(
        Long id,
        String content,
        String sender,
        LocalDateTime createdAt
) {
}
