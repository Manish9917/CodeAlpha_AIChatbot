package com.codealpha.chatbot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChatRequest(

        Long conversationId,

        @NotBlank(message = "Message must not be empty.")
        @Size(max = 1000, message = "Message must not exceed 1000 characters.")
        String message

) {
}
