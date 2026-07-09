package com.skillpath.service;

import com.skillpath.dto.LoginRequest;
import com.skillpath.dto.UserRequest;
import com.skillpath.dto.UserResponse;
import com.skillpath.entity.Progress;
import com.skillpath.entity.User;
import com.skillpath.repository.ProgressRepository;
import com.skillpath.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final ProgressRepository progressRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public UserResponse registerUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        User savedUser = userRepository.save(user);
        
        // Create initial progress for the user
        Progress progress = new Progress();
        progress.setUser(savedUser);
        progress.setCompletedTasks(0);
        progress.setStars(0);
        progress.setTotalXp(0);
        progress.setCurrentStreak(0);
        progressRepository.save(progress);
        
        return mapToResponse(savedUser);
    }
    
    public Optional<UserResponse> login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return Optional.of(mapToResponse(user));
            }
        }
        
        return Optional.empty();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}

