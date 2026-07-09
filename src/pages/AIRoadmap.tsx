import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import AIRoadmapForm from "@/components/AIRoadmapForm";
import AIRoadmapViewer from "@/components/AIRoadmapViewer";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { generateAIRoadmap, getUserRoadmaps, deleteAIRoadmap, AIRoadmapRequest, AIRoadmapResponse } from "@/lib/aiRoadmapApi";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const AIRoadmap = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [roadmaps, setRoadmaps] = useState<AIRoadmapResponse[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // We only show one roadmap at a time in this view, typically the latest one
  const activeRoadmap = roadmaps.length > 0 ? roadmaps[0] : null;

  useEffect(() => {
    if (user) {
      fetchRoadmaps();
    }
  }, [user]);

  const fetchRoadmaps = async () => {
    setIsFetching(true);
    try {
      const data = await getUserRoadmaps(user!.id);
      setRoadmaps(data);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to fetch roadmaps",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleGenerate = async (request: AIRoadmapRequest) => {
    setIsGenerating(true);
    try {
      const newRoadmap = await generateAIRoadmap(user!.id, request);
      setRoadmaps([newRoadmap, ...roadmaps]);
      toast({
        title: "Roadmap Generated! 🎉",
        description: "Your personalized learning path is ready.",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to generate roadmap",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this roadmap?")) return;
    
    setIsDeleting(true);
    try {
      await deleteAIRoadmap(id, user!.id);
      setRoadmaps(roadmaps.filter(r => r.id !== id));
      toast({
        title: "Roadmap deleted",
        description: "Your roadmap has been successfully removed.",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to delete roadmap",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleGenerateNew = () => {
    // Clear current roadmaps state temporarily to show form
    // (If they refresh, it will fetch again from DB)
    setRoadmaps([]);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <BackButton />
      
      <main className="flex-1 container mx-auto px-6 pt-32 pb-20">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading your AI roadmaps...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {activeRoadmap && !isGenerating ? (
              <AIRoadmapViewer 
                roadmap={activeRoadmap} 
                onDelete={handleDelete}
                onGenerateNew={handleGenerateNew}
                isDeleting={isDeleting}
              />
            ) : (
              <AIRoadmapForm 
                onSubmit={handleGenerate} 
                isLoading={isGenerating} 
              />
            )}
          </motion.div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default AIRoadmap;
