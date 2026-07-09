package com.skillpath.controller;

import com.skillpath.dto.QuestionDTO;
import com.skillpath.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuestionController {
    
    private final QuestionService questionService;
    
    /**
     * GET /api/daily-task
     * Generate and return a new random coding question
     * Optional query param: language (e.g., Python, JavaScript, Java)
     */
    @GetMapping("/daily-task")
    public ResponseEntity<?> getDailyTask(@RequestParam(required = false) String language) {
        try {
            QuestionDTO question = questionService.getDailyTask(language);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * POST /api/task-complete
     * Generate a new random coding question when user completes a task
     * Optional body: { "language": "Python" }
     */
    @PostMapping("/task-complete")
    public ResponseEntity<?> completeTask(@RequestBody(required = false) Map<String, String> request) {
        try {
            String language = request != null ? request.get("language") : null;
            QuestionDTO question = questionService.generateNewQuestion(language, null);
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/questions")
    public ResponseEntity<List<QuestionDTO>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }
    
@GetMapping("/questions/{language}")
    public ResponseEntity<List<QuestionDTO>> getQuestionsByLanguage(@PathVariable String language) {
        return ResponseEntity.ok(questionService.getQuestionsByLanguage(language));
    }

    /**
     * GET /api/daily-questions?language=Python&difficulty=easy
     * Get exactly 2 random questions for daily tasks (generates if needed)
     */
    /**
     * GET /api/daily-questions?language=Python&difficulty=easy
     * Get exactly 2 random questions for daily tasks (generates if needed)
     */
    @GetMapping("/daily-questions")
    public ResponseEntity<?> getDailyQuestions(
            @RequestParam String language,
            @RequestParam String difficulty) {
        try {
            List<QuestionDTO> questions = questionService.getDailyQuestionsByLanguageAndDifficulty(language, difficulty);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}

