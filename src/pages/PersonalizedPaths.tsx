import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Code2,
  Play, BookOpen, Hammer, Trophy, Map, Clock, Target, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { getPersonalizedRoadmap, ExperienceLevel } from "@/data/personalizedRoadmaps";

interface Language {
  name: string;
  emoji: string;
  category: string;
  description: string;
  slug: string;
}

const allLanguages: Language[] = [
  { name: "Python", emoji: "🐍", category: "General Purpose", description: "Versatile, beginner-friendly, great for AI/ML and scripting.", slug: "python" },
  { name: "Java", emoji: "☕", category: "General Purpose", description: "Enterprise-grade, cross-platform, strongly typed.", slug: "java" },
  { name: "JavaScript", emoji: "🌐", category: "Web", description: "The language of the web — frontend and backend.", slug: "javascript" },
  { name: "TypeScript", emoji: "🔷", category: "Web", description: "JavaScript with types for safer, scalable code.", slug: "typescript" },
  { name: "C", emoji: "⚙️", category: "Systems", description: "Low-level systems programming and embedded systems.", slug: "cpp" },
  { name: "C++", emoji: "🔧", category: "Systems", description: "High-performance applications, games, and systems.", slug: "cpp" },
  { name: "C#", emoji: "💜", category: "General Purpose", description: "Microsoft ecosystem, game dev with Unity, enterprise apps.", slug: "java" },
  { name: "Go", emoji: "🐹", category: "Systems", description: "Fast, simple, built for cloud and microservices.", slug: "backend" },
  { name: "Rust", emoji: "🦀", category: "Systems", description: "Memory-safe systems programming without garbage collection.", slug: "backend" },
  { name: "Kotlin", emoji: "🟣", category: "Mobile", description: "Modern Android development, concise and safe.", slug: "java" },
  { name: "Swift", emoji: "🍎", category: "Mobile", description: "iOS and macOS app development by Apple.", slug: "java" },
  { name: "Dart", emoji: "🎯", category: "Mobile", description: "Powers Flutter for cross-platform mobile apps.", slug: "javascript" },
  { name: "PHP", emoji: "🐘", category: "Web", description: "Server-side scripting, powers WordPress and Laravel.", slug: "backend" },
  { name: "Ruby", emoji: "💎", category: "Web", description: "Elegant syntax, great for web apps with Rails.", slug: "backend" },
  { name: "SQL", emoji: "🗃️", category: "Data", description: "Query and manage relational databases.", slug: "sql" },
  { name: "R", emoji: "📊", category: "Data", description: "Statistical computing and data visualization.", slug: "python" },
  { name: "Scala", emoji: "🔴", category: "General Purpose", description: "Functional + OOP on the JVM, big data with Spark.", slug: "java" },
  { name: "Shell/Bash", emoji: "🖥️", category: "DevOps", description: "Automate tasks and manage servers via command line.", slug: "backend" },
];

const categories = [...new Set(allLanguages.map(l => l.category))];

interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  options: { label: string; value: string; desc?: string }[];
}

const questions: QuizQuestion[] = [
  {
    id: "experience",
    question: "What's your current experience?",
    subtitle: "Be honest — this determines which topics you skip vs focus on.",
    options: [
      { label: "🌱 Complete Beginner", value: "beginner", desc: "I've never written code before" },
      { label: "📘 Know some basics", value: "basic", desc: "I understand variables, loops, and functions" },
      { label: "💻 Intermediate coder", value: "intermediate", desc: "I've built some projects and understand OOP" },
      { label: "🚀 Advanced developer", value: "advanced", desc: "I'm ready for senior-level topics" },
    ],
  },
  {
    id: "pace",
    question: "How many hours per week can you dedicate?",
    subtitle: "This affects the duration estimate of your roadmap.",
    options: [
      { label: "⏰ 1-3 hours", value: "light", desc: "Casual learner" },
      { label: "📅 4-7 hours", value: "moderate", desc: "Consistent learner" },
      { label: "💪 8-15 hours", value: "dedicated", desc: "Focused learner" },
      { label: "🔥 15+ hours", value: "intensive", desc: "Full-time learner" },
    ],
  },
  {
    id: "style",
    question: "How do you prefer to learn?",
    subtitle: "Your answer will show completely different content for each option.",
    options: [
      { label: "📺 Video Tutorials", value: "video", desc: "Best YouTube playlists in Telugu, Hindi & English" },
      { label: "📖 Reading Docs", value: "reading", desc: "Official docs, books, and trusted tutorial sites" },
      { label: "🛠️ Building Projects", value: "projects", desc: "Project ideas by difficulty with GitHub examples" },
      { label: "🧩 Solving Challenges", value: "challenges", desc: "Coding platforms: LeetCode, HackerRank, Codeforces" },
      { label: "📋 I want a Roadmap", value: "roadmap", desc: "Structured phase-by-phase learning path" },
    ],
  },
];

const PACE_MULTIPLIER: Record<string, number> = {
  intensive: 0.5,
  dedicated: 0.75,
  moderate: 1,
  light: 1.5,
};

const PersonalizedPaths = () => {
  const [mode, setMode] = useState<"choose" | "quiz" | "results">("choose");
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [filterCat, setFilterCat] = useState<string>("All");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const filteredLangs = filterCat === "All" ? allLanguages : allLanguages.filter(l => l.category === filterCat);

  const handleSelectLang = (lang: Language) => {
    setSelectedLang(lang);
    setStep(0);
    setAnswers({});
    setMode("quiz");
  };

  const handleAnswer = (qId: string, value: string) => {
    const updated = { ...answers, [qId]: value };
    setAnswers(updated);
    if (step < questions.length - 1) {
      setTimeout(() => setStep(s => s + 1), 300);
    } else {
      setTimeout(() => handleResults(updated), 400);
    }
  };

  const handleResults = (finalAnswers: Record<string, string>) => {
    const style = finalAnswers.style;
    const statePayload = {
      langName: selectedLang?.name,
      langSlug: selectedLang?.slug,
      langEmoji: selectedLang?.emoji,
    };

    if (style === "video") {
      navigate("/videos", { state: statePayload });
    } else if (style === "reading") {
      navigate("/reading", { state: statePayload });
    } else if (style === "projects") {
      navigate("/projects", { state: statePayload });
    } else if (style === "challenges") {
      navigate("/challenges", { state: statePayload });
    } else {
      // "roadmap" — show results page
      setMode("results");
    }
  };

  const getRoadmap = () => {
    if (!selectedLang) return null;
    const exp = (answers.experience as ExperienceLevel) || "beginner";
    return getPersonalizedRoadmap(selectedLang.slug, exp);
  };

  const roadmap = mode === "results" ? getRoadmap() : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BackButton />
      <main className="container mx-auto px-6 pb-20 pt-28 max-w-4xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
              <Zap className="h-6 w-6 text-secondary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Personalized Path</h1>
          </div>
          <p className="text-muted-foreground">Choose a language, answer 3 questions, and get content tailored specifically to your level and learning style.</p>
        </motion.div>

        {/* ── CHOOSE LANGUAGE ──────────────────────────────────── */}
        {mode === "choose" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-wrap gap-2 mb-8">
              {["All", ...categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCat(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    filterCat === cat
                      ? "bg-secondary text-secondary-foreground border-secondary"
                      : "bg-card text-muted-foreground border-border hover:border-secondary/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLangs.map((lang, i) => (
                <motion.div
                  key={lang.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => handleSelectLang(lang)}
                  className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-secondary/40"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{lang.emoji}</span>
                    <h3 className="font-semibold text-card-foreground">{lang.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{lang.description}</p>
                  <div className="flex items-center gap-1 text-xs text-secondary font-medium">
                    <Code2 className="h-3.5 w-3.5" /> {lang.category}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── QUIZ ─────────────────────────────────────────────── */}
        {mode === "quiz" && selectedLang && (
          <>
            <div className="mb-6 rounded-xl border border-secondary/20 bg-secondary/5 p-4 flex items-center gap-3">
              <span className="text-2xl">{selectedLang.emoji}</span>
              <div>
                <p className="font-semibold text-foreground">{selectedLang.name}</p>
                <p className="text-xs text-muted-foreground">{selectedLang.description}</p>
              </div>
              <button
                onClick={() => setMode("choose")}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground"
              >
                Change
              </button>
            </div>

            <div className="mb-6 flex gap-1.5">
              {questions.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-secondary" : "bg-muted"}`} />
              ))}
            </div>

            <p className="text-xs text-muted-foreground mb-4">Step {step + 1} of {questions.length}</p>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="mb-1 text-xl font-bold text-foreground">{questions[step].question}</h2>
                {questions[step].subtitle && (
                  <p className="text-sm text-muted-foreground mb-5">{questions[step].subtitle}</p>
                )}
                <div className="space-y-3">
                  {questions[step].options.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(questions[step].id, option.value)}
                      className={`w-full rounded-xl border p-4 text-left transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 ${
                        answers[questions[step].id] === option.value
                          ? "border-secondary bg-secondary/10 text-foreground"
                          : "border-border bg-card text-card-foreground hover:border-secondary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-base font-medium">{option.label}</span>
                          {option.desc && <p className="text-xs text-muted-foreground mt-0.5">{option.desc}</p>}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}

        {/* ── RESULTS (Roadmap mode only) ───────────────────────── */}
        {mode === "results" && selectedLang && roadmap && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Summary banner */}
            <div className="mb-8 rounded-xl border border-secondary/30 bg-secondary/5 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-secondary" />
                    <h2 className="text-xl font-bold text-foreground">
                      Your {selectedLang.emoji} {selectedLang.name} Roadmap
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Est. duration: <strong className="text-secondary ml-1">{roadmap.duration}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      Experience: <strong className="text-secondary ml-1 capitalize">{answers.experience}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Map className="h-4 w-4" />
                      {roadmap.phases.length} phases
                    </span>
                  </div>
                  {roadmap.skipNote && (
                    <p className="mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 inline-block">
                      ✂️ {roadmap.skipNote}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Phases */}
            <div className="space-y-4">
              {roadmap.phases.map((phase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-secondary/40"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-sm font-bold text-secondary shrink-0">
                        {i + 1}
                      </div>
                      <h3 className="font-bold text-card-foreground text-base">{phase.title}</h3>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Clock className="h-3 w-3" /> {phase.duration}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 ml-11">{phase.description}</p>

                  {/* Topics */}
                  <div className="ml-11 mb-3">
                    <p className="text-xs font-semibold text-foreground mb-2">Topics covered:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.topics.map(topic => (
                        <span key={topic} className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Project idea */}
                  <div className="ml-11 flex items-center gap-2 text-xs text-accent">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span><strong>Phase project:</strong> {phase.projectIdea}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Other learning styles */}
            <div className="mt-8 rounded-xl border border-border bg-card/50 p-5">
              <p className="text-sm font-semibold text-foreground mb-3">Supplement your roadmap with:</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Play, label: "Video Tutorials", route: "/videos", color: "text-red-500" },
                  { icon: BookOpen, label: "Official Docs", route: "/reading", color: "text-emerald-500" },
                  { icon: Hammer, label: "Project Ideas", route: "/projects", color: "text-violet-500" },
                ].map(item => (
                  <button
                    key={item.route}
                    onClick={() => navigate(item.route, { state: { langName: selectedLang.name, langSlug: selectedLang.slug, langEmoji: selectedLang.emoji } })}
                    className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 hover:border-secondary/40 transition-all text-sm font-medium text-foreground"
                  >
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    {item.label}
                    <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>

            {/* View full roadmap CTA */}
            <div className="mt-4 flex gap-3">
              <Button
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => navigate(`/roadmap/${selectedLang.slug}`)}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Open Full {selectedLang.name} Roadmap
              </Button>
              <Button variant="outline" onClick={() => { setMode("choose"); setSelectedLang(null); setAnswers({}); setStep(0); }}>
                Start Over
              </Button>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PersonalizedPaths;
