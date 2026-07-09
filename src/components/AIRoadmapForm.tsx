import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIRoadmapRequest } from "@/lib/aiRoadmapApi";

interface AIRoadmapFormProps {
  onSubmit: (request: AIRoadmapRequest) => void;
  isLoading: boolean;
}

const AIRoadmapForm: React.FC<AIRoadmapFormProps> = ({ onSubmit, isLoading }) => {
  const [careerGoal, setCareerGoal] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [currentSkills, setCurrentSkills] = useState("");
  const [studyHours, setStudyHours] = useState("1-2 hours");
  const [duration, setDuration] = useState("3 Months");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!careerGoal || !currentSkills) return;
    
    onSubmit({
      careerGoal,
      skillLevel,
      currentSkills,
      studyHours,
      duration,
    });
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-lg border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Generate AI Roadmap
        </CardTitle>
        <CardDescription>
          Tell us your career goals and current skills, and our AI will generate a personalized step-by-step learning path.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Career Goal</label>
            <Input
              placeholder="e.g. Java Full Stack Developer, AI Engineer"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              required
              disabled={isLoading}
              className="bg-background/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Skill Level</label>
              <Select value={skillLevel} onValueChange={setSkillLevel} disabled={isLoading}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Duration</label>
              <Select value={duration} onValueChange={setDuration} disabled={isLoading}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 Month">1 Month</SelectItem>
                  <SelectItem value="3 Months">3 Months</SelectItem>
                  <SelectItem value="6 Months">6 Months</SelectItem>
                  <SelectItem value="12 Months">12 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Current Skills (Be specific)</label>
            <Textarea
              placeholder="e.g. HTML, CSS, basic JavaScript, loops and functions..."
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              required
              disabled={isLoading}
              className="min-h-[100px] bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Study Hours Per Day</label>
            <Select value={studyHours} onValueChange={setStudyHours} disabled={isLoading}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select hours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-2 hours">1-2 hours</SelectItem>
                <SelectItem value="2-4 hours">2-4 hours</SelectItem>
                <SelectItem value="4-6 hours">4-6 hours</SelectItem>
                <SelectItem value="8+ hours">8+ hours (Full time)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            disabled={isLoading || !careerGoal || !currentSkills}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Roadmap... (This may take up to a minute)
              </>
            ) : (
              <>
                Generate Personalized Roadmap
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AIRoadmapForm;
