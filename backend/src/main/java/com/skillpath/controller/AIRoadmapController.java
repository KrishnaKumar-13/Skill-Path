package com.skillpath.controller;

import com.skillpath.dto.AIRoadmapRequestDTO;
import com.skillpath.entity.AIRoadmap;
import com.skillpath.service.AIRoadmapService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai-roadmap")
public class AIRoadmapController {

    private final AIRoadmapService aiRoadmapService;

    public AIRoadmapController(AIRoadmapService aiRoadmapService) {
        this.aiRoadmapService = aiRoadmapService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateRoadmap(
            @RequestParam UUID userId,
            @RequestBody AIRoadmapRequestDTO requestDTO) {
        try {
            AIRoadmap roadmap = aiRoadmapService.generateAndSaveRoadmap(userId, requestDTO);
            return ResponseEntity.ok(roadmap);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserRoadmaps(@RequestParam UUID userId) {
        try {
            List<AIRoadmap> roadmaps = aiRoadmapService.getUserRoadmaps(userId);
            return ResponseEntity.ok(roadmaps);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoadmap(
            @PathVariable UUID id,
            @RequestParam UUID userId) {
        try {
            aiRoadmapService.deleteRoadmap(id, userId);
            return ResponseEntity.ok(Map.of("message", "Roadmap deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
