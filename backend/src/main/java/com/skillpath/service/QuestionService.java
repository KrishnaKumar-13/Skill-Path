package com.skillpath.service;

import com.skillpath.dto.QuestionDTO;
import com.skillpath.entity.Question;
import com.skillpath.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class QuestionService {
    
    private final QuestionRepository questionRepository;
    private final QuestionGeneratorService questionGenerator;
    private final Random random = new Random();
    
    public QuestionDTO generateNewQuestion(String language, String difficulty) {
        // Generate a new dynamic question
        QuestionGeneratorService.QuestionData questionData = questionGenerator.generateQuestion(language, difficulty);
        
        // Create and save the question to database
        Question question = new Question(
            questionData.getTitle(),
            questionData.getQuestionText(),
            questionData.getQuestionText(), // description
            questionData.getStarterCode(),
            questionData.getLanguage(),
            questionData.getDifficulty(),
            questionData.getXp()
        );
        
        Question savedQuestion = questionRepository.save(question);
        return mapToDTO(savedQuestion);
    }
    
    public QuestionDTO getDailyTask(String language) {
        // Generate a new random question
        return generateNewQuestion(language, null);
    }
    
    public QuestionDTO getRandomQuestion() {
        // Generate a completely random question
        QuestionGeneratorService.QuestionData questionData = questionGenerator.generateRandomQuestion();
        
        Question question = new Question(
            questionData.getTitle(),
            questionData.getQuestionText(),
            questionData.getQuestionText(), // description
            questionData.getStarterCode(),
            questionData.getLanguage(),
            questionData.getDifficulty(),
            questionData.getXp()
        );
        
        Question savedQuestion = questionRepository.save(question);
        return mapToDTO(savedQuestion);
    }
    
    public QuestionDTO getRandomQuestionByLanguage(String language) {
        return generateNewQuestion(language, null);
    }
    
    public List<QuestionDTO> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(this::mapToDTO)
                .toList();
    }
    
    public List<QuestionDTO> getQuestionsByLanguage(String language) {
        return questionRepository.findByLanguage(language).stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<QuestionDTO> getDailyQuestionsByLanguageAndDifficulty(String language, String difficulty) {
        // Always generate fresh random questions for variety
        List<QuestionDTO> dtos = new ArrayList<>();
        dtos.add(generateNewQuestion(language, difficulty));
        dtos.add(generateNewQuestion(language, difficulty));
        return dtos;
    }
    
    public Optional<Question> getQuestionById(Long id) {
        return questionRepository.findById(id);
    }
    
    private QuestionDTO mapToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setQuestionText(question.getQuestionText());
        dto.setTitle(question.getTitle());
        dto.setDescription(question.getDescription());
        dto.setStarterCode(question.getStarterCode());
        dto.setLanguage(question.getLanguage());
        dto.setDifficulty(question.getDifficulty());
        dto.setXp(question.getXp());
        return dto;
    }
}

