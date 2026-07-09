package com.skillpath.repository;

import com.skillpath.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    List<Question> findByLanguage(String language);
    
    List<Question> findByLanguageAndDifficulty(String language, String difficulty);
    
    @Query(value = "SELECT * FROM questions ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Question findRandomQuestion();
    
    @Query(value = "SELECT * FROM questions WHERE language = :language ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Question findRandomQuestionByLanguage(@Param("language") String language);

    @Query(value = "SELECT * FROM questions WHERE language = :language AND difficulty = :difficulty ORDER BY RAND() LIMIT 2", nativeQuery = true)
    List<Question> findRandomQuestionsByLanguageAndDifficulty(@Param("language") String language, @Param("difficulty") String difficulty);
}

