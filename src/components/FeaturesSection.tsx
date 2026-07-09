import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, Target, Trophy, Brain, Zap, BarChart3, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Map,
    title: "Level-Wise Roadmaps",
    description: "Clear progression from beginner to advanced with structured milestones at every level.",
    detail: "Follow structured, level-wise learning paths designed by industry experts. Each roadmap breaks down complex skills into digestible levels — from fundamentals to mastery — so you always know what to learn next.",
    cta: { label: "Browse Roadmaps", path: "/roadmaps" },
  },
  {
    icon: Target,
    title: "Daily Tasks & Challenges",
    description: "Stay consistent with daily practice exercises and real-time coding challenges.",
    detail: "Receive fresh coding challenges every day tailored to your current skill level. Build consistency through daily practice, solve real-world problems, and earn XP to level up.",
    cta: { label: "View Today's Tasks", path: "/daily-tasks" },
  },
  {
    icon: Trophy,
    title: "Gamified Learning",
    description: "Earn badges, unlock achievements, and compete on leaderboards to stay motivated.",
    detail: "Mark milestones as done to earn badges! Track achievements across categories like streaks, daily tasks, and exploration. Collect them all to become a SkillPath legend.",
    cta: { label: "View Achievements", path: "/achievements" },
  },
  {
    icon: Brain,
    title: "Curated Resources",
    description: "Hand-picked learning materials from YouTube, Udemy, docs, and more — all in one place.",
    detail: "No more searching across platforms. We curate the best free and paid resources — videos, articles, documentation, and projects — organized by topic and difficulty level.",
    cta: { label: "Explore Resources", path: "/resources" },
  },
  {
    icon: Zap,
    title: "Personalized Paths",
    description: "AI-powered recommendations that adapt to your pace, goals, and learning style.",
    detail: "Answer a few quick questions about your experience, goals, and preferred pace — and we'll recommend the perfect learning path tailored just for you.",
    cta: { label: "Find Your Path", path: "/personalized" },
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Visual dashboards showing your growth, streaks, and skill proficiency over time.",
    detail: "Track your learning consistency month by month with an interactive calendar. See your streaks, active days, and completion rates at a glance.",
    cta: { label: "Track Progress", path: "/progress" },
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  const [selectedFeature, setSelectedFeature] = useState<(typeof features)[0] | null>(null);
  const navigate = useNavigate();

  return (
    <>
      <section id="features" className="py-24 bg-background relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-40 bg-accent/5 blur-3xl pointer-events-none rounded-full" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-accent">
              Features
            </span>
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need to Learn{" "}
              <span className="text-gradient-cyan">Effectively</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              A complete ecosystem designed to take you from confused beginner to confident professional.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={item}
                onClick={() => setSelectedFeature(feature)}
                className="group glow-border cursor-pointer rounded-2xl border border-border bg-card p-8 shadow-card transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 transition-all duration-300 group-hover:bg-accent/20 group-hover:shadow-glow">
                  <feature.icon className="h-6 w-6 text-accent transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Learn more <ArrowRight className="h-3 w-3" />
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Detail Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedFeature(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-glow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
                <selectedFeature.icon className="h-7 w-7 text-accent" />
              </div>

              <h3 className="mb-3 text-xl font-bold text-card-foreground">
                {selectedFeature.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                {selectedFeature.detail}
              </p>

              <Button
                onClick={() => {
                  setSelectedFeature(null);
                  navigate(selectedFeature.cta.path);
                }}
                className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow"
              >
                {selectedFeature.cta.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeaturesSection;
