package com.skillpath.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.ZonedDateTime;
import java.util.UUID;
import com.fasterxml.jackson.databind.JsonNode;

@Entity
@Table(name = "ai_roadmaps")
public class AIRoadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "career_goal", nullable = false)
    private String careerGoal;

    @Column(name = "skill_level", nullable = false)
    private String skillLevel;

    @Column(name = "current_skills", nullable = false)
    private String currentSkills;

    @Column(name = "study_hours", nullable = false)
    private String studyHours;

    @Column(name = "duration", nullable = false)
    private String duration;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "roadmap_json", columnDefinition = "jsonb")
    private JsonNode roadmapJson;

    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = ZonedDateTime.now();
        updatedAt = ZonedDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = ZonedDateTime.now();
    }

    public AIRoadmap() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getCareerGoal() { return careerGoal; }
    public void setCareerGoal(String careerGoal) { this.careerGoal = careerGoal; }

    public String getSkillLevel() { return skillLevel; }
    public void setSkillLevel(String skillLevel) { this.skillLevel = skillLevel; }

    public String getCurrentSkills() { return currentSkills; }
    public void setCurrentSkills(String currentSkills) { this.currentSkills = currentSkills; }

    public String getStudyHours() { return studyHours; }
    public void setStudyHours(String studyHours) { this.studyHours = studyHours; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public JsonNode getRoadmapJson() { return roadmapJson; }
    public void setRoadmapJson(JsonNode roadmapJson) { this.roadmapJson = roadmapJson; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(ZonedDateTime createdAt) { this.createdAt = createdAt; }

    public ZonedDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(ZonedDateTime updatedAt) { this.updatedAt = updatedAt; }
}
