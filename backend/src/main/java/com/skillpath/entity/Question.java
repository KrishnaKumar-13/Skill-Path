package com.skillpath.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "starter_code", columnDefinition = "TEXT")
    private String starterCode;
    
    @Column(nullable = false)
    private String language;
    
    @Column(nullable = false)
    private String difficulty;
    
    @Column
    private Integer xp;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Custom constructor without id and createdAt (for creating new questions)
    public Question(String title, String questionText, String description, String starterCode, String language, String difficulty, Integer xp) {
        this.title = title;
        this.questionText = questionText;
        this.description = description;
        this.starterCode = starterCode;
        this.language = language;
        this.difficulty = difficulty;
        this.xp = xp;
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

