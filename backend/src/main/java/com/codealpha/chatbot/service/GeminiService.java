package com.codealpha.chatbot.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String apiUrl;
    private final String apiKey;
    private final String model;

    public GeminiService(
            @Value("${groq.api.url}") String apiUrl,
            @Value("${groq.api.key}") String apiKey,
            @Value("${groq.api.model}") String model) {

        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();

        this.objectMapper = new ObjectMapper();
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        this.model = model;
    }

    public String generateReply(String userMessage) {
        try {
            var requestBody = objectMapper.createObjectNode();

            requestBody.put("model", model);
            requestBody.put("temperature", 0.7);
            requestBody.put("max_tokens", 1024);

            var messages = requestBody.putArray("messages");

            messages.addObject()
                    .put("role", "system")
                    .put("content",
                            "You are a helpful, friendly AI chatbot. "
                            + "Give clear, accurate and concise answers.");

            messages.addObject()
                    .put("role", "user")
                    .put("content", userMessage);

            String jsonBody =
                    objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .timeout(Duration.ofSeconds(60))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString());

            int statusCode = response.statusCode();

            System.out.println("Groq HTTP Status: " + statusCode);

            if (statusCode < 200 || statusCode >= 300) {
                System.err.println(
                        "Groq API error response: " + response.body());

                throw new GroqApiException(
                        "Groq API request failed with HTTP status "
                                + statusCode);
            }

            JsonNode responseJson =
                    objectMapper.readTree(response.body());

            JsonNode textNode = responseJson.path("choices")
                    .path(0)
                    .path("message")
                    .path("content");

            if (textNode.isMissingNode()
                    || textNode.isNull()
                    || textNode.asText().isBlank()) {
                throw new GroqApiException(
                        "Groq returned an empty response.");
            }

            return textNode.asText().trim();

        } catch (IOException e) {
            throw new GroqApiException(
                    "Could not communicate with Groq API.", e);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();

            throw new GroqApiException(
                    "Groq API request was interrupted.", e);

        } catch (IllegalArgumentException e) {
            throw new GroqApiException(
                    "Groq API URL is invalid.", e);
        }
    }

    public static class GroqApiException extends RuntimeException {

        public GroqApiException(String message) {
            super(message);
        }

        public GroqApiException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
