package com.skillpath.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProgressDTO {
    
    private Long id;
    private Long userId;
    private Integer completedTasks;
    private Integer stars;
    private Integer totalXp;
    private Integer currentStreak;
    private LocalDateTime lastTaskDate;
}

