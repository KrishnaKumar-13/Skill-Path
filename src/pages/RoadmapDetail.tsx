import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, BookOpen, Video, FileText, Code, Folder, CheckCircle2, Lock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { roadmapDetails } from "@/data/roadmapData";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const resourceIcons: Record<string, typeof Video> = {
  video: Video,
  article: FileText,
  docs: BookOpen,
  exercise: Code,
  project: Folder,
};

const resourceColors: Record<string, string> = {
  video: "text-red-500 bg-red-500/10",
  article: "text-blue-500 bg-blue-500/10",
  docs: "text-emerald bg-emerald/10",
  exercise: "text-secondary bg-secondary/10",
  project: "text-violet-500 bg-violet-500/10",
};

const RoadmapDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const roadmap = slug ? roadmapDetails[slug] : null;
  const [expandedLevel, setExpandedLevel] = useState<number | null>(1);
  const { user } = useAuth();

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <BackButton />
        <div className="container mx-auto px-6 pt-32 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Roadmap Not Found</h1>
          <Link to="/roadmaps">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Roadmaps
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const totalTopics = roadmap.levels.reduce((sum, l) => sum + l.topics.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BackButton />

      {/* Hero */}
      <section className="pt-32 pb-12 bg-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle, hsl(40 95% 55%) 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} />
        <div className="container mx-auto px-6 relative z-10">
          <Link to="/roadmaps" className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground mb-6 text-sm transition-colors">
            <ArrowLeft className="h-4 w-4" /> All Roadmaps
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="text-5xl mb-4 block">{roadmap.emoji}</span>
            <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">
              {roadmap.name} <span className="text-gradient-gold">Roadmap</span>
            </h1>
            <p className="text-lg text-primary-foreground/70 mb-6">{roadmap.description}</p>
            <div className="flex flex-wrap gap-6 text-sm text-primary-foreground/60">
              <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {roadmap.totalHours} hours</span>
              <span className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> {roadmap.levels.length} levels</span>
              <span className="flex items-center gap-2"><Code className="h-4 w-4" /> {totalTopics} topics</span>
            </div>
            {!user && (
              <Link to="/auth">
                <Button className="mt-8 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-gold font-semibold" size="lg">
                  Sign Up to Start Learning
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Roadmap Levels */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

            <div className="space-y-4">
              {roadmap.levels.map((level, index) => {
                const isExpanded = expandedLevel === level.level;
                return (
                  <motion.div
                    key={level.level}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative"
                  >
                    {/* Level number circle */}
                    <div className="absolute left-0 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm z-10 shadow-card">
                      L{level.level}
                    </div>

                    <div className="md:ml-20">
                      <button
                        onClick={() => setExpandedLevel(isExpanded ? null : level.level)}
                        className="w-full text-left rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-xs font-bold text-secondary md:hidden">Level {level.level}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {level.estimatedHours}h
                              </span>
                              <span className="text-xs text-muted-foreground">{level.topics.length} topics</span>
                            </div>
                            <h3 className="text-lg font-bold text-card-foreground">{level.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{level.description}</p>
                          </div>
                          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                      </button>

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-2 space-y-2 pl-2"
                        >
                          {level.topics.map((topic, tIndex) => {
                            const Icon = resourceIcons[topic.resourceType] || BookOpen;
                            const colorClass = resourceColors[topic.resourceType] || "text-muted-foreground bg-muted";
                            return (
                              <motion.div
                                key={tIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: tIndex * 0.04 }}
                                className="flex items-start gap-4 rounded-xl border border-border/50 bg-card/50 p-4 transition-all hover:bg-card"
                              >
                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-card-foreground">{topic.title}</h4>
                                  <p className="text-xs text-muted-foreground mt-0.5">{topic.description}</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-xs text-muted-foreground">{topic.duration}min</span>
                                  <span className="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize bg-muted text-muted-foreground">
                                    {topic.resourceType}
                                  </span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RoadmapDetail;
