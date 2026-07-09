import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, CheckCircle2, Circle, Star, Award, Medal, Crown, Gem, Rocket, Target, Flame, BookOpen, ArrowLeft, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { getTotalCompletions } from "@/lib/api";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
  requiredTasks: number;
  stars: 1 | 2 | 3;
  unlocked: boolean;
}

const BADGE_KEY = "skillpath-task-badges";

const defaultAchievements: Omit<Achievement, "unlocked">[] = [
  // 1-Star Badges
  { id: "first-task", title: "First Steps", description: "Complete your very first daily task.", icon: Star, category: "Getting Started", requiredTasks: 1, stars: 1 },
  { id: "three-tasks", title: "Getting Warm", description: "Complete 3 daily tasks total.", icon: Zap, category: "Getting Started", requiredTasks: 3, stars: 1 },
  { id: "five-tasks", title: "Task Enthusiast", description: "Complete 5 daily tasks total.", icon: Target, category: "Daily Tasks", requiredTasks: 5, stars: 1 },
  // 2-Star Badges
  { id: "ten-tasks", title: "Dedicated Coder", description: "Complete 10 daily tasks total.", icon: Medal, category: "Daily Tasks", requiredTasks: 10, stars: 2 },
  { id: "fifteen-tasks", title: "Consistent Learner", description: "Complete 15 daily tasks total.", icon: BookOpen, category: "Daily Tasks", requiredTasks: 15, stars: 2 },
  { id: "twenty-tasks", title: "Rising Star", description: "Complete 20 daily tasks total.", icon: Rocket, category: "Milestones", requiredTasks: 20, stars: 2 },
  // 3-Star Badges
  { id: "thirty-tasks", title: "Expert Coder", description: "Complete 30 daily tasks total.", icon: Gem, category: "Milestones", requiredTasks: 30, stars: 3 },
  { id: "forty-tasks", title: "Code Warrior", description: "Complete 40 daily tasks total.", icon: Crown, category: "Milestones", requiredTasks: 40, stars: 3 },
  { id: "fifty-tasks", title: "Legendary", description: "Complete 50 daily tasks total.", icon: Trophy, category: "Milestones", requiredTasks: 50, stars: 3 },
  { id: "hundred-tasks", title: "Grandmaster", description: "Complete 100 daily tasks total.", icon: Award, category: "Legendary", requiredTasks: 100, stars: 3 },
];

const STORAGE_KEY = "skillpath-achievements";

const starColor: Record<number, string> = {
  1: "text-accent",
  2: "text-secondary",
  3: "text-yellow-400",
};

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      // Prefer Supabase total (works cross-device); fall back to localStorage
      let total = 0;
      try {
        total = await getTotalCompletions();
        // Sync localStorage so offline reads stay accurate
        const badgeData = JSON.parse(localStorage.getItem(BADGE_KEY) || '{"total":0}');
        if (total > (badgeData.total || 0)) {
          localStorage.setItem(BADGE_KEY, JSON.stringify({ total }));
        }
      } catch {
        // Not logged in or network error — use localStorage fallback
        const badgeData = JSON.parse(localStorage.getItem(BADGE_KEY) || '{"total":0}');
        total = badgeData.total || 0;
      }

      setTotalCompleted(total);

      // Auto-unlock based on total completed tasks
      const saved = localStorage.getItem(STORAGE_KEY);
      const previous: Record<string, boolean> = saved ? JSON.parse(saved) : {};

      const computed = defaultAchievements.map(def => ({
        ...def,
        unlocked: total >= def.requiredTasks,
      }));

      // Check for newly unlocked
      computed.forEach(a => {
        if (a.unlocked && !previous[a.id]) {
          setJustUnlocked(a.id);
          setTimeout(() => setJustUnlocked(null), 3000);
        }
      });

      // Save current unlock state
      const unlockMap: Record<string, boolean> = {};
      computed.forEach(a => { unlockMap[a.id] = a.unlocked; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockMap));

      setAchievements(computed);
    };

    load();
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const categories = [...new Set(defaultAchievements.map(a => a.category))];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BackButton />
      <main className="container mx-auto px-6 pb-20 pt-28">
        <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
              <Trophy className="h-6 w-6 text-secondary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Achievements & Badges</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Complete daily tasks to automatically earn star badges. More tasks = higher star ranks!
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-card-foreground">Badges Unlocked</span>
            <span className="text-sm font-bold text-secondary">{unlockedCount}/{achievements.length}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-secondary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${achievements.length > 0 ? (unlockedCount / achievements.length) * 100 : 0}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Total tasks completed: <span className="text-foreground font-medium">{totalCompleted}</span></p>
        </motion.div>

        {/* Star legend */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-8 flex gap-6 text-sm text-muted-foreground">
          {[
            { stars: 1, label: "Bronze (1-9 tasks)" },
            { stars: 2, label: "Silver (10-29 tasks)" },
            { stars: 3, label: "Gold (30+ tasks)" },
          ].map(tier => (
            <div key={tier.stars} className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[1, 2, 3].map(s => (
                  <Star key={s} className={`h-3.5 w-3.5 ${s <= tier.stars ? starColor[tier.stars] + " fill-current" : "text-muted-foreground/20"}`} />
                ))}
              </div>
              <span>{tier.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Grouped by category */}
        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {achievements
                .filter(a => a.category === category)
                .map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative rounded-xl border p-5 transition-all duration-300 ${
                      achievement.unlocked
                        ? "border-secondary/40 bg-secondary/5 shadow-card"
                        : "border-border bg-card opacity-60"
                    } ${justUnlocked === achievement.id ? "ring-2 ring-secondary ring-offset-2 ring-offset-background" : ""}`}
                  >
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-3">
                      {[1, 2, 3].map(s => (
                        <motion.div
                          key={s}
                          initial={justUnlocked === achievement.id ? { scale: 0, rotate: -30 } : {}}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: s * 0.1 }}
                        >
                          <Star className={`h-4 w-4 ${
                            s <= achievement.stars && achievement.unlocked
                              ? starColor[achievement.stars] + " fill-current"
                              : "text-muted-foreground/20"
                          }`} />
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                        achievement.unlocked ? "bg-secondary/20" : "bg-muted"
                      }`}>
                        <achievement.icon className={`h-5 w-5 ${achievement.unlocked ? "text-secondary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-card-foreground text-sm">{achievement.title}</h3>
                          {achievement.unlocked ? (
                            <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{achievement.description}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">Requires {achievement.requiredTasks} tasks</p>
                      </div>
                    </div>

                    {/* New badge animation */}
                    <AnimatePresence>
                      {justUnlocked === achievement.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full"
                        >
                          NEW!
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default Achievements;
