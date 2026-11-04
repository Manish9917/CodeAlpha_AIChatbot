package com.codealpha.chatbot.dto;

public class AuthResponse {

    private Long userId;
    private String fullName;
    private String email;
    private String token;
    private String message;

    public AuthResponse() {
    }

    public AuthResponse(Long userId, String fullName, String email, String token, String message) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.token = token;
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getToken() {
        return token;
    }

    public String getMessage() {
        return message;
    }
}
