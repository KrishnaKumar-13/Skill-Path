import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight,
  CalendarDays, TrendingUp, Flame, Zap, Target, Code2, Award
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { getCompletionDates, getProfile, getCompletionsByDifficulty, Profile } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const ProgressTracker = () => {
  const today = new Date();
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [completedDates, setCompletedDates] = useState<Set<string>>(new Set());
  const [profile, setProfile] = useState<Profile | null>(null);
  const [diffStats, setDiffStats] = useState({ easy: 0, medium: 0, hard: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        getCompletionDates(),
        getProfile(),
        getCompletionsByDifficulty(),
      ]).then(([dates, prof, diff]) => {
        setCompletedDates(new Set(dates));
        setProfile(prof);
        setDiffStats(diff);
      }).finally(() => setLoading(false));
    }
  }, [user]);

  const getMonthDays = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
      return { date, completed: completedDates.has(date) };
    });
  };

  const days = getMonthDays(currentYear, currentMonth);
  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const completedDaysCount = days.filter(d => d.completed).length;
  const activeDays = days.filter(d => new Date(d.date) <= today).length;

  // Calculate streak from profile (accurate) or from completion dates
  const streak = profile?.streak_days ?? 0;

  // Longest streak (from completion dates)
  const longestStreak = (() => {
    const sorted = [...completedDates].sort();
    let max = 0, cur = 0;
    for (let i = 0; i < sorted.length; i++) {
      if (i === 0) { cur = 1; max = 1; continue; }
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diff = (curr.getTime() - prev.getTime()) / 86400000;
      if (diff === 1) { cur++; max = Math.max(max, cur); }
      else cur = 1;
    }
    return max;
  })();

  const total = diffStats.easy + diffStats.medium + diffStats.hard;
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <BarChart3 className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Progress Tracker</h1>
          </div>
          <p className="text-muted-foreground">Your personal learning analytics — all data is yours and private.</p>
        </motion.div>

        {/* Top stats row */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Zap, label: "Total XP", value: (profile?.xp_points ?? 0).toLocaleString(), color: "text-secondary", bg: "bg-secondary/10" },
            { icon: Award, label: "Level", value: `Level ${profile?.level ?? 1}`, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { icon: Flame, label: "Streak", value: `${streak} days`, color: "text-orange-500", bg: "bg-orange-500/10" },
            { icon: TrendingUp, label: "Longest Streak", value: `${longestStreak} days`, color: "text-purple-500", bg: "bg-purple-500/10" },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2 ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-xl font-bold text-card-foreground">{loading ? "—" : stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Difficulty breakdown */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-accent" /> Problems Solved by Difficulty
            </h2>
            <span className="text-sm text-muted-foreground">{total} total</span>
          </div>
          <div className="space-y-3">
            {[
              { label: "Easy", value: diffStats.easy, color: "bg-green-500", text: "text-green-600" },
              { label: "Medium", value: diffStats.medium, color: "bg-yellow-500", text: "text-yellow-600" },
              { label: "Hard", value: diffStats.hard, color: "bg-red-500", text: "text-red-600" },
            ].map(row => {
              const pct = total > 0 ? Math.round((row.value / total) * 100) : 0;
              return (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className={`font-semibold ${row.text}`}>{row.label}</span>
                    <span className="text-muted-foreground">{row.value} solved ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full rounded-full ${row.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Monthly stats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6 grid grid-cols-3 gap-4">
          {[
            { icon: CalendarDays, label: "Active Days This Month", value: `${completedDaysCount}/${activeDays}`, color: "text-accent" },
            { icon: TrendingUp, label: "Monthly Consistency", value: activeDays > 0 ? `${Math.round((completedDaysCount / activeDays) * 100)}%` : "0%", color: "text-secondary" },
            { icon: Code2, label: "Total Days Active", value: completedDates.size, color: "text-blue-500" },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4 text-center">
              <stat.icon className={`h-5 w-5 mx-auto mb-1 ${stat.color}`} />
              <p className="text-xl font-bold text-card-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Calendar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-1 rounded hover:bg-muted transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-card-foreground">{MONTHS[currentMonth]} {currentYear}</h2>
            <button onClick={nextMonth} className="p-1 rounded hover:bg-muted transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`empty-${i}`} />)}
            {days.map(day => {
              const dayDate = new Date(day.date + "T00:00:00");
              const isFuture = dayDate > today;
              const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
              const isToday = day.date === todayStr;

              return (
                <div
                  key={day.date}
                  title={day.completed ? `✅ Completed on ${day.date}` : day.date}
                  className={`relative flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${
                    isFuture ? "text-muted-foreground/30"
                    : day.completed ? "bg-accent/20 text-accent"
                    : "text-card-foreground hover:bg-muted"
                  } ${isToday ? "ring-2 ring-secondary ring-offset-1 ring-offset-card" : ""}`}
                >
                  {new Date(day.date + "T00:00:00").getDate()}
                  {day.completed && (
                    <CheckCircle2 className="absolute -top-0.5 -right-0.5 h-3 w-3 text-accent" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground justify-center">
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-accent/20 inline-block" /> Completed</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded ring-2 ring-secondary inline-block" /> Today</span>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ProgressTracker;
