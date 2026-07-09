import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Zap, ChevronDown, ChevronUp, RefreshCw,
  Lightbulb, Tag, Building2, Clock, BarChart2, BookOpen,
  Code2, Eye, EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/lib/api";

const DIFF_CONFIG = {
  easy:   { label: "Easy",   bg: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",  dot: "bg-green-500",  xp: 10 },
  medium: { label: "Medium", bg: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", dot: "bg-yellow-500", xp: 20 },
  hard:   { label: "Hard",   bg: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",    dot: "bg-red-500",    xp: 35 },
} as const;

interface Props {
  question: Question;
  index: number;
  completed: boolean;
  onComplete: (index: number) => void;
  isCurrent: boolean;
  disabled: boolean;
  isLoading: boolean;
}

const QuestionDetailCard = ({ question, index, completed, onComplete, isCurrent, disabled, isLoading }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const key = question.difficulty?.toLowerCase() as keyof typeof DIFF_CONFIG;
  const diff = DIFF_CONFIG[key] ?? DIFF_CONFIG.medium;

  const hints = [question.hint1, question.hint2, question.hint3].filter(Boolean);

  return (
    <motion.div
      layout
      className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden
        ${completed ? "border-green-300 bg-green-50/50 dark:bg-green-950/20" : "border-border bg-card hover:border-secondary/40"}
        ${isCurrent && !completed ? "border-blue-400 shadow-lg shadow-blue-100/50 ring-2 ring-blue-300 ring-offset-2" : ""}
        ${disabled ? "opacity-40 pointer-events-none" : ""}
      `}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Difficulty badge */}
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${diff.bg}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${diff.dot}`} />
              {diff.label}
            </span>

            {/* Topic tag */}
            {question.topic && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                <Tag className="h-3 w-3" /> {question.topic}
              </span>
            )}

            {/* Q number */}
            <span className="text-xs text-muted-foreground font-medium">Q{index + 1}</span>
          </div>

          {/* XP badge */}
          <span className={`flex items-center gap-1 font-bold text-sm ${completed ? "text-green-600" : "text-primary"}`}>
            {completed ? <CheckCircle2 className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
            {question.xp_reward} XP
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-card-foreground mb-2 leading-snug">
          {question.title}
        </h3>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
          {question.estimated_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> ~{question.estimated_minutes} min
            </span>
          )}
          {question.acceptance_rate && (
            <span className="flex items-center gap-1">
              <BarChart2 className="h-3 w-3" /> {question.acceptance_rate}% acceptance
            </span>
          )}
          {question.companies && question.companies.length > 0 && (
            <span className="flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {question.companies.slice(0, 2).join(", ")}
              {question.companies.length > 2 && ` +${question.companies.length - 2}`}
            </span>
          )}
        </div>

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {question.tags.map(tag => (
              <span key={tag} className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded-full font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Expandable Body ─────────────────────────────── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-4">
              {/* Question text */}
              <div>
                <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" /> Problem
                </p>
                <p className="text-sm leading-relaxed text-card-foreground whitespace-pre-wrap">
                  {question.question_text}
                </p>
              </div>

              {/* Constraints */}
              {question.constraints && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Constraints:</p>
                  <pre className="text-xs text-muted-foreground bg-muted p-3 rounded-lg whitespace-pre-wrap font-mono">
                    {question.constraints}
                  </pre>
                </div>
              )}

              {/* Example I/O */}
              {(question.example_input || question.example_output) && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {question.example_input && (
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-1">Input:</p>
                      <pre className="text-xs bg-slate-900 text-green-400 p-3 rounded-lg font-mono overflow-x-auto">
                        {question.example_input}
                      </pre>
                    </div>
                  )}
                  {question.example_output && (
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-1">Output:</p>
                      <pre className="text-xs bg-slate-900 text-blue-400 p-3 rounded-lg font-mono overflow-x-auto">
                        {question.example_output}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Starter code */}
              {question.starter_code && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                    <Code2 className="h-3.5 w-3.5" /> Starter Code
                  </p>
                  <div className="bg-slate-900 text-green-400 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                    <pre>{question.starter_code}</pre>
                  </div>
                </div>
              )}

              {/* Hints */}
              {hints.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                    <Lightbulb className="h-3.5 w-3.5 text-yellow-500" /> Hints ({hintsRevealed}/{hints.length} revealed)
                  </p>
                  <div className="space-y-2">
                    {hints.map((hint, hi) => (
                      <div key={hi}>
                        {hi < hintsRevealed ? (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-800 p-3"
                          >
                            <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-1">
                              💡 Hint {hi + 1}
                            </p>
                            <p className="text-xs text-yellow-900 dark:text-yellow-300">{hint}</p>
                          </motion.div>
                        ) : (
                          <button
                            onClick={() => setHintsRevealed(hi + 1)}
                            className="w-full rounded-lg border border-dashed border-yellow-300 p-3 text-xs text-yellow-600 hover:bg-yellow-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <Lightbulb className="h-3.5 w-3.5" />
                            Reveal Hint {hi + 1}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer Actions ──────────────────────────────── */}
      <div className="px-5 pb-5 space-y-2">
        {/* Expand toggle */}
        <Button
          variant="ghost" size="sm"
          className="w-full border-dashed border h-8 text-xs"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded
            ? <><ChevronUp className="h-4 w-4 mr-1" /> Hide Details</>
            : <><ChevronDown className="h-4 w-4 mr-1" /> Show Full Problem + Hints + Examples</>}
        </Button>

        {/* Mark complete */}
        {isCurrent && !completed && (
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold gap-2 h-10"
            onClick={() => onComplete(index)}
            disabled={isLoading}
          >
            {isLoading
              ? <><RefreshCw className="h-4 w-4 animate-spin" /> Submitting...</>
              : <><CheckCircle2 className="h-4 w-4" /> Mark as Complete — +{question.xp_reward} XP</>}
          </Button>
        )}

        {/* Completed state */}
        {completed && (
          <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-2 rounded-lg text-sm font-medium">
            <CheckCircle2 className="h-4 w-4" />
            Completed! +{question.xp_reward} XP earned
          </div>
        )}

        {/* Current task badge */}
        {isCurrent && !completed && (
          <Badge variant="default" className="w-full justify-center bg-blue-100 text-blue-800 border-blue-200 text-xs h-6">
            🎯 Current Task — Complete this to unlock the next
          </Badge>
        )}
      </div>
    </motion.div>
  );
};

export default QuestionDetailCard;
