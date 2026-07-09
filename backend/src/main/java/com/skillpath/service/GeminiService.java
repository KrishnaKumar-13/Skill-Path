package com.skillpath.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {
    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);
    
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public JsonNode generateRoadmap(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

        try {
            // Build the request body
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> parts = new HashMap<>();
            parts.put("text", prompt);
            
            Map<String, Object> contents = new HashMap<>();
            contents.put("parts", List.of(parts));
            
            requestBody.put("contents", List.of(contents));

            // Force JSON response from Gemini
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("responseMimeType", "application/json");
            requestBody.put("generationConfig", generationConfig);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            logger.info("Sending request to Gemini API...");
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    JsonNode partsNode = candidates.get(0).path("content").path("parts");
                    if (partsNode.isArray() && partsNode.size() > 0) {
                        String text = partsNode.get(0).path("text").asText();
                        // The text itself is a JSON string because of generationConfig
                        return objectMapper.readTree(text);
                    }
                }
                throw new RuntimeException("Unexpected response structure from Gemini API");
            } else {
                logger.error("Gemini API Error: {}", response.getBody());
                throw new RuntimeException("Failed to generate roadmap from Gemini API. HTTP " + response.getStatusCode());
            }

        } catch (Exception e) {
            logger.error("Exception while calling Gemini API: {}", e.getMessage(), e);
            throw new RuntimeException("Error communicating with AI service: " + e.getMessage());
        }
    }
}
