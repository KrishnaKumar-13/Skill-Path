package com.skillpath.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.skillpath.dto.AIRoadmapRequestDTO;
import com.skillpath.entity.AIRoadmap;
import com.skillpath.repository.AIRoadmapRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AIRoadmapService {
    private static final Logger logger = LoggerFactory.getLogger(AIRoadmapService.class);

    private final AIRoadmapRepository aiRoadmapRepository;
    private final GeminiService geminiService;

    public AIRoadmapService(AIRoadmapRepository aiRoadmapRepository, GeminiService geminiService) {
        this.aiRoadmapRepository = aiRoadmapRepository;
        this.geminiService = geminiService;
    }

    public AIRoadmap generateAndSaveRoadmap(UUID userId, AIRoadmapRequestDTO requestDTO) {
        String prompt = buildPrompt(requestDTO);
        
        logger.info("Generating AI Roadmap for user: {}", userId);
        JsonNode roadmapJson = geminiService.generateRoadmap(prompt);

        AIRoadmap roadmap = new AIRoadmap();
        roadmap.setUserId(userId);
        roadmap.setCareerGoal(requestDTO.getCareerGoal());
        roadmap.setSkillLevel(requestDTO.getSkillLevel());
        roadmap.setCurrentSkills(requestDTO.getCurrentSkills());
        roadmap.setStudyHours(requestDTO.getStudyHours());
        roadmap.setDuration(requestDTO.getDuration());
        roadmap.setRoadmapJson(roadmapJson);

        logger.info("Saving generated roadmap to database for user: {}", userId);
        return aiRoadmapRepository.save(roadmap);
    }

    public List<AIRoadmap> getUserRoadmaps(UUID userId) {
        return aiRoadmapRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void deleteRoadmap(UUID id, UUID userId) {
        AIRoadmap roadmap = aiRoadmapRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Roadmap not found"));

        if (!roadmap.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this roadmap");
        }

        aiRoadmapRepository.delete(roadmap);
    }

    private String buildPrompt(AIRoadmapRequestDTO dto) {
        return "You are an expert software engineering mentor.\n\n" +
               "Generate a personalized learning roadmap.\n\n" +
               "Career Goal:\n" + dto.getCareerGoal() + "\n\n" +
               "Current Skill Level:\n" + dto.getSkillLevel() + "\n\n" +
               "Current Skills:\n" + dto.getCurrentSkills() + "\n\n" +
               "Study Hours Per Day:\n" + dto.getStudyHours() + "\n\n" +
               "Target Duration:\n" + dto.getDuration() + "\n\n" +
               "Return ONLY valid JSON. Example:\n" +
               "{\n" +
               "\"title\":\"Java Full Stack Roadmap\",\n" +
               "\"duration\":\"6 Months\",\n" +
               "\"months\":[\n" +
               "{\n" +
               "\"month\":1,\n" +
               "\"title\":\"Java Fundamentals\",\n" +
               "\"topics\":[\"Variables\",\"OOP\",\"Collections\"],\n" +
               "\"resources\":[\"Official Docs\",\"YouTube\",\"LeetCode\"],\n" +
               "\"practice\":[\"2 Coding Problems Daily\"],\n" +
               "\"project\":\"Library Management\",\n" +
               "\"milestone\":\"Complete Core Java\"\n" +
               "}\n" +
               "]\n" +
               "}\n\n" +
               "Do NOT return Markdown. Do NOT return explanations. Return only JSON.";
    }
}
