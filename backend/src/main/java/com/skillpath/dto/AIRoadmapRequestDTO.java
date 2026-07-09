package com.skillpath.dto;

public class AIRoadmapRequestDTO {
    private String careerGoal;
    private String skillLevel;
    private String currentSkills;
    private String studyHours;
    private String duration;

    public AIRoadmapRequestDTO() {}

    public String getCareerGoal() {
        return careerGoal;
    }

    public void setCareerGoal(String careerGoal) {
        this.careerGoal = careerGoal;
    }

    public String getSkillLevel() {
        return skillLevel;
    }

    public void setSkillLevel(String skillLevel) {
        this.skillLevel = skillLevel;
    }

    public String getCurrentSkills() {
        return currentSkills;
    }

    public void setCurrentSkills(String currentSkills) {
        this.currentSkills = currentSkills;
    }

    public String getStudyHours() {
        return studyHours;
    }

    public void setStudyHours(String studyHours) {
        this.studyHours = studyHours;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }
}
