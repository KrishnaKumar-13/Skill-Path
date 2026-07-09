package com.skillpath.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Progress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "completed_tasks")
    private Integer completedTasks;
    
    @Column
    private Integer stars;
    
    @Column(name = "total_xp")
    private Integer totalXp;
    
    @Column(name = "current_streak")
    private Integer currentStreak;
    
    @Column(name = "last_task_date")
    private LocalDateTime lastTaskDate;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (completedTasks == null) completedTasks = 0;
        if (stars == null) stars = 0;
        if (totalXp == null) totalXp = 0;
        if (currentStreak == null) currentStreak = 0;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

