package com.skillpath.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {
    
    private Long id;
    private String questionText;
    private String title;
    private String description;
    private String starterCode;
    private String language;
    private String difficulty;
    private Integer xp;
}

