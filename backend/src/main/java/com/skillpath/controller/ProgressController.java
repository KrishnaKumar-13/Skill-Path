package com.skillpath.controller;

import com.skillpath.dto.ProgressDTO;
import com.skillpath.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProgressController {
    
    private final ProgressService progressService;
    
    @GetMapping("/users/{userId}/progress")
    public ResponseEntity<?> getUserProgress(@PathVariable Long userId) {
        try {
            ProgressDTO progress = progressService.getProgressByUserId(userId);
            return ResponseEntity.ok(progress);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/users/{userId}/progress")
    public ResponseEntity<?> updateProgress(
            @PathVariable Long userId,
            @RequestBody Map<String, Integer> request) {
        try {
            int xpEarned = request.getOrDefault("xp", 0);
            ProgressDTO progress = progressService.updateProgress(userId, xpEarned);
            return ResponseEntity.ok(progress);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/users/{userId}/complete-task")
    public ResponseEntity<?> completeTask(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> request) {
        try {
            Integer xp = request.get("xp") != null ? ((Number) request.get("xp")).intValue() : 10;
            ProgressDTO progress = progressService.updateProgress(userId, xp);
            return ResponseEntity.ok(progress);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}

