import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Code, CheckCircle, Trash2, RefreshCw, Trophy, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { AIRoadmapResponse } from "@/lib/aiRoadmapApi";

interface AIRoadmapViewerProps {
  roadmap: AIRoadmapResponse;
  onDelete: (id: string) => void;
  onGenerateNew: () => void;
  isDeleting: boolean;
}

const AIRoadmapViewer: React.FC<AIRoadmapViewerProps> = ({ roadmap, onDelete, onGenerateNew, isDeleting }) => {
  const data = roadmap.roadmapJson;

  if (!data || !data.months) {
    return (
      <div className="text-center p-8 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive">
        <p>Roadmap data is missing or malformed.</p>
        <Button onClick={onGenerateNew} className="mt-4" variant="outline">Try Again</Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-card/60 border border-border/50 p-6 rounded-2xl backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              {roadmap.skillLevel}
            </Badge>
            <Badge variant="outline">{roadmap.duration}</Badge>
            <Badge variant="outline">{roadmap.studyHours}/day</Badge>
          </div>
          <h1 className="text-3xl font-bold font-display text-foreground mb-2">
            {data.title || `${roadmap.careerGoal} Roadmap`}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            Generated on {new Date(roadmap.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" onClick={onGenerateNew} disabled={isDeleting} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Generate New
          </Button>
          <Button variant="destructive" onClick={() => onDelete(roadmap.id)} disabled={isDeleting} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Timeline Accordion */}
      <div className="bg-card/30 rounded-2xl p-4 md:p-8 border border-border/30">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
          <Layout className="h-5 w-5 text-primary" />
          Your Learning Path
        </h2>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {data.months.map((month, index) => (
            <AccordionItem 
              key={index} 
              value={`month-${month.month || index}`}
              className="border border-border/50 bg-card rounded-xl overflow-hidden shadow-sm"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30 data-[state=open]:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4 text-left">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary font-bold shrink-0">
                    M{month.month || index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{month.title}</h3>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  
                  {/* Topics */}
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2 text-foreground/80">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      Key Topics
                    </h4>
                    <ul className="space-y-2">
                      {month.topics?.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-blue-500 mt-0.5">•</span> {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resources */}
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2 text-foreground/80">
                      <Layout className="h-4 w-4 text-purple-500" />
                      Recommended Resources
                    </h4>
                    <ul className="space-y-2">
                      {month.resources?.map((res, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-purple-500 mt-0.5">•</span> {res}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Practice */}
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2 text-foreground/80">
                      <Code className="h-4 w-4 text-green-500" />
                      Practice & Exercises
                    </h4>
                    <ul className="space-y-2">
                      {month.practice?.map((prac, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-green-500 mt-0.5">•</span> {prac}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Project & Milestone */}
                  <div className="space-y-4">
                    <Card className="bg-accent/5 border-accent/20">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm flex items-center gap-2 text-accent">
                          <Code className="h-4 w-4" /> Mini Project
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0 text-sm">
                        {month.project}
                      </CardContent>
                    </Card>

                    <Card className="bg-orange-500/5 border-orange-500/20">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-sm flex items-center gap-2 text-orange-600 dark:text-orange-400">
                          <Trophy className="h-4 w-4" /> Milestone
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0 text-sm text-muted-foreground">
                        {month.milestone}
                      </CardContent>
                    </Card>
                  </div>

                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </motion.div>
  );
};

export default AIRoadmapViewer;
