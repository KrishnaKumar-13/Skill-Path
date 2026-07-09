import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowLeft, Play, Trophy, RefreshCw, LogIn, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import QuestionDetailCard from "@/components/QuestionDetailCard";
import { Question, getDailyQuestions, addXP, recordCompletion } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LANGUAGES = ["Python", "JavaScript", "Java", "C++", "DSA", "SQL"] as const;
type Language = (typeof LANGUAGES)[number];

const LANGUAGE_ICONS: Record<string, string> = {
  Python: "🐍", JavaScript: "🟡", Java: "☕", "C++": "⚡", DSA: "🧠", SQL: "🗄️",
};

const DailyTasks = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [selectedLanguage, setSelectedLanguage] = useState<Language>("Python");
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<boolean[]>([]);
  const [earnedXP, setEarnedXP] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Track shown question IDs to avoid repeats on refresh
  const [shownQuestionIds, setShownQuestionIds] = useState<Set<string>>(new Set());

  const today = new Date().toDateString();

  // ── User-scoped storage key (CRITICAL: prevents cross-user data leak) ──────
  // Key includes user.id so UserA and UserB never share localStorage state
  const storageKey = user
    ? `daily-progress-${user.id}-${selectedLanguage}-${today}`
    : null;

  // ── Load persisted progress on mount / language switch ────────────────────
  useEffect(() => {
    if (!storageKey) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const p = JSON.parse(saved);
      setCurrentQuestionIndex(p.currentIndex ?? 0);
      setCompletedQuestions(p.completed ?? []);
      setEarnedXP(p.earnedXP ?? 0);
    } else {
      setCurrentQuestionIndex(0);
      setCompletedQuestions([]);
      setEarnedXP(0);
    }
  }, [storageKey]);

  const saveProgress = useCallback((completed: boolean[], index: number, xp: number) => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify({ completed, currentIndex: index, earnedXP: xp }));
  }, [storageKey]);

  // ── Load 6 questions (2 easy + 2 medium + 2 hard) ────────────────────────
  const loadQuestions = useCallback(async (lang: Language, excludeIds: string[] = []) => {
    setIsLoading(true);
    try {
      const [easy, medium, hard] = await Promise.all([
        getDailyQuestions(lang, "easy", excludeIds),
        getDailyQuestions(lang, "medium", excludeIds),
        getDailyQuestions(lang, "hard", excludeIds),
      ]);

      const all = [
        ...easy.slice(0, 2),
        ...medium.slice(0, 2),
        ...hard.slice(0, 2),
      ];

      setCurrentQuestions(all);

      // Track all shown IDs for refresh exclusion
      setShownQuestionIds(prev => {
        const updated = new Set(prev);
        all.forEach(q => updated.add(q.id));
        return updated;
      });
    } catch (err) {
      console.error("Failed to load questions:", err);
      toast({
        title: "Failed to load questions",
        description: "Check your Supabase connection or run FULL_SETUP.sql.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user) loadQuestions(selectedLanguage);
  }, [user, selectedLanguage, loadQuestions]);

  // ── Mark complete ─────────────────────────────────────────────────────────
  const handleComplete = async (index: number) => {
    if (completedQuestions[index] || !user) return;
    const question = currentQuestions[index];
    if (!question) return;

    setIsLoading(true);
    try {
      await recordCompletion(question.id, question.xp_reward);
      await addXP(question.xp_reward);

      const newCompleted = [...completedQuestions];
      newCompleted[index] = true;
      setCompletedQuestions(newCompleted);

      const newXP = earnedXP + question.xp_reward;
      setEarnedXP(newXP);
      const nextIndex = index + 1;
      setCurrentQuestionIndex(nextIndex);
      saveProgress(newCompleted, nextIndex, newXP);

      // Update badge counter (user-scoped)
      const BADGE_KEY = `skillpath-task-badges-${user.id}`;
      const badgeData = JSON.parse(localStorage.getItem(BADGE_KEY) || '{"total":0}');
      badgeData.total = (badgeData.total || 0) + 1;
      localStorage.setItem(BADGE_KEY, JSON.stringify(badgeData));

      toast({
        title: "Task Completed! 🎉",
        description: `+${question.xp_reward} XP earned! Progress: ${Math.round(((index + 1) / currentQuestions.length) * 100)}%`,
      });
    } catch (err) {
      console.error("Complete error:", err);
      toast({ title: "Failed to complete task", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Refresh without repeating shown questions ─────────────────────────────
  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (storageKey) localStorage.removeItem(storageKey);
    setCurrentQuestionIndex(0);
    setCompletedQuestions([]);
    setEarnedXP(0);

    // Pass all previously shown IDs to exclude them
    const excludeList = Array.from(shownQuestionIds);
    await loadQuestions(selectedLanguage, excludeList);
    setIsRefreshing(false);

    toast({ title: "New questions loaded!", description: "Fresh set — no repeats from your recent history." });
  };

  const handleNewSet = async () => {
    setIsRefreshing(true);
    if (storageKey) localStorage.removeItem(storageKey);
    setCurrentQuestionIndex(0);
    setCompletedQuestions([]);
    setEarnedXP(0);
    setShownQuestionIds(new Set()); // Clear history for a completely fresh start
    await loadQuestions(selectedLanguage);
    setIsRefreshing(false);
  };

  const progressPercentage = currentQuestions.length > 0
    ? (currentQuestionIndex / currentQuestions.length) * 100 : 0;
  const isSetComplete = currentQuestions.length > 0 && currentQuestionIndex >= currentQuestions.length;

  // ── Auth guard ────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <BackButton />
        <main className="container mx-auto px-6 pb-20 pt-28">
          <div className="text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Daily Tasks</h1>
            <p className="text-muted-foreground mb-8">
              Sign in to access coding challenges and track your XP progress.
            </p>
            <Button asChild size="lg">
              <Link to="/auth">Sign In / Sign Up</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BackButton />
      <main className="container mx-auto px-6 pb-20 pt-28">
        <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Daily Tasks</h1>
              <p className="text-muted-foreground text-sm">
                6 challenges per language (2 Easy + 2 Medium + 2 Hard) — earn XP saved to your profile
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="flex items-center gap-1 h-7">
                <Zap className="h-3 w-3" /> {earnedXP} XP today
              </Badge>
              <Badge variant="outline" className="h-7">
                {completedQuestions.filter(Boolean).length}/{currentQuestions.length} done
              </Badge>
              {/* Refresh without repeat button */}
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading}
                className="h-7 text-xs gap-1"
                title="Load different questions (no repeats)"
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Language tabs */}
          <div className="overflow-x-auto pb-1">
            <Tabs value={selectedLanguage} onValueChange={(v) => setSelectedLanguage(v as Language)} className="w-full">
              <TabsList className="inline-flex w-auto gap-1 h-auto p-1 flex-wrap">
                {LANGUAGES.map((lang) => (
                  <TabsTrigger
                    key={lang} value={lang}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <span>{LANGUAGE_ICONS[lang]}</span>
                    <span>{lang}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Progress: {Math.min(currentQuestionIndex + 1, currentQuestions.length || 6)} of {currentQuestions.length || 6}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Content */}
        {isLoading && currentQuestions.length === 0 ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="h-5 w-16 bg-muted rounded-full" />
                  <div className="h-5 w-24 bg-muted rounded-full" />
                </div>
                <div className="h-4 w-3/4 bg-muted rounded mb-2" />
                <div className="h-3 w-1/2 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : currentQuestions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No questions found for {selectedLanguage}</h3>
              <p className="text-muted-foreground mb-4">
                Make sure you've run <code className="bg-muted px-1 rounded">docs/FULL_SETUP.sql</code> in your Supabase dashboard.
              </p>
              <Button onClick={() => loadQuestions(selectedLanguage)} disabled={isLoading} variant="outline">
                {isLoading ? "Loading..." : "Retry"}
              </Button>
            </CardContent>
          </Card>
        ) : isSetComplete ? (
          // Completion celebration
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-200">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-3">All Done! 🎉</h2>
            <p className="text-muted-foreground text-lg mb-2">
              You completed all {currentQuestions.length} {selectedLanguage} challenges today!
            </p>
            <p className="text-2xl font-bold text-primary mb-8">+{earnedXP} XP saved to your profile</p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                More Questions (No Repeats)
              </Button>
              <Button variant="outline" onClick={handleNewSet} disabled={isRefreshing} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Fresh Start
              </Button>
            </div>
          </motion.div>
        ) : (
          // Question sections
          <div className="space-y-10">
            {[
              { label: "🟢 Easy", badge: "bg-green-100 text-green-800 border-green-200", slice: [0, 2] as [number, number], hint: "10 XP each" },
              { label: "🟡 Medium", badge: "bg-yellow-100 text-yellow-800 border-yellow-200", slice: [2, 4] as [number, number], hint: "20 XP each" },
              { label: "🔴 Hard", badge: "bg-red-100 text-red-800 border-red-200", slice: [4, 6] as [number, number], hint: "35 XP each" },
            ].map(({ label, badge, slice, hint }) => {
              const sectionQuestions = currentQuestions.slice(slice[0], slice[1]);
              if (sectionQuestions.length === 0) return null;
              return (
                <div key={label}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-bold border ${badge}`}>{label}</span>
                    <span className="text-muted-foreground text-sm">Questions {slice[0] + 1}–{slice[1]} · {hint}</span>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    {sectionQuestions.map((question, i) => {
                      const actualIndex = slice[0] + i;
                      return (
                        <QuestionDetailCard
                          key={question.id}
                          question={question}
                          index={actualIndex}
                          completed={completedQuestions[actualIndex] ?? false}
                          onComplete={handleComplete}
                          isCurrent={actualIndex === currentQuestionIndex}
                          disabled={actualIndex > currentQuestionIndex}
                          isLoading={isLoading && actualIndex === currentQuestionIndex}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DailyTasks;
