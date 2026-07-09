package com.skillpath.service;

import com.skillpath.dto.ProgressDTO;
import com.skillpath.entity.Progress;
import com.skillpath.entity.User;
import com.skillpath.repository.ProgressRepository;
import com.skillpath.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProgressService {
    
    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public ProgressDTO updateProgress(Long userId, int xpEarned) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Progress progress = progressRepository.findByUser(user)
                .orElseGet(() -> createInitialProgress(user));
        
        // Update completed tasks count
        progress.setCompletedTasks(progress.getCompletedTasks() + 1);
        
        // Update total XP
        progress.setTotalXp(progress.getTotalXp() + xpEarned);
        
        // Update streak
        LocalDate today = LocalDate.now();
        LocalDate lastTaskDate = progress.getLastTaskDate() != null 
                ? progress.getLastTaskDate().toLocalDate() 
                : null;
        
        if (lastTaskDate == null) {
            progress.setCurrentStreak(1);
        } else if (lastTaskDate.equals(today.minusDays(1))) {
            progress.setCurrentStreak(progress.getCurrentStreak() + 1);
        } else if (!lastTaskDate.equals(today)) {
            progress.setCurrentStreak(1);
        }
        
        // Update stars based on completed tasks
        progress.setStars(calculateStars(progress.getCompletedTasks()));
        
        // Update last task date
        progress.setLastTaskDate(LocalDateTime.now());
        
        Progress savedProgress = progressRepository.save(progress);
        
        return mapToDTO(savedProgress);
    }
    
    public ProgressDTO getProgressByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Progress progress = progressRepository.findByUser(user)
                .orElseGet(() -> createInitialProgress(user));
        
        return mapToDTO(progress);
    }
    
    public Optional<Progress> getProgress(Long userId) {
        return userRepository.findById(userId)
                .flatMap(progressRepository::findByUser);
    }
    
    private Progress createInitialProgress(User user) {
        Progress progress = new Progress();
        progress.setUser(user);
        progress.setCompletedTasks(0);
        progress.setStars(0);
        progress.setTotalXp(0);
        progress.setCurrentStreak(0);
        return progressRepository.save(progress);
    }
    
    private int calculateStars(int completedTasks) {
        if (completedTasks >= 50) return 3;
        if (completedTasks >= 20) return 3;
        if (completedTasks >= 10) return 2;
        if (completedTasks >= 5) return 2;
        if (completedTasks >= 1) return 1;
        return 0;
    }
    
    private ProgressDTO mapToDTO(Progress progress) {
        ProgressDTO dto = new ProgressDTO();
        dto.setId(progress.getId());
        dto.setUserId(progress.getUser().getId());
        dto.setCompletedTasks(progress.getCompletedTasks());
        dto.setStars(progress.getStars());
        dto.setTotalXp(progress.getTotalXp());
        dto.setCurrentStreak(progress.getCurrentStreak());
        dto.setLastTaskDate(progress.getLastTaskDate());
        return dto;
    }
}

