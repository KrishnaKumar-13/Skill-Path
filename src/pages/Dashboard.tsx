import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Flame, Target, BookOpen, ArrowRight, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";
import { getProfile, getTotalCompletions, Profile } from "@/lib/api";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [totalTasks, setTotalTasks] = useState(0);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      Promise.all([getProfile(), getTotalCompletions()])
        .then(([prof, tasks]) => {
          setProfile(prof);
          setTotalTasks(tasks);
        })
        .catch(console.error)
        .finally(() => setProfileLoading(false));
    }
  }, [user]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const xpToNextLevel = 100 - (profile?.xp_points ?? 0) % 100;
  const levelProgress = 100 - xpToNextLevel;

  const stats = [
    {
      icon: Trophy,
      label: "XP Points",
      value: profile?.xp_points ?? 0,
      color: "text-secondary bg-secondary/10",
      suffix: "XP",
    },
    {
      icon: Star,
      label: "Level",
      value: profile?.level ?? 1,
      color: "text-emerald-500 bg-emerald-500/10",
      suffix: "",
    },
    {
      icon: Flame,
      label: "Day Streak",
      value: profile?.streak_days ?? 0,
      color: "text-orange-500 bg-orange-500/10",
      suffix: "days",
    },
    {
      icon: Target,
      label: "Tasks Done",
      value: totalTasks,
      color: "text-blue-500 bg-blue-500/10",
      suffix: "",
    },
  ];

  const displayName =
    profile?.display_name ||
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "Learner";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BackButton />

      <section className="pt-32 pb-8">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, <span className="text-gradient-gold">{displayName}</span>! 👋
            </h1>
            <p className="text-muted-foreground">Here's your learning progress overview.</p>
          </motion.div>
        </div>
      </section>

      {/* Level Progress Bar */}
      <section className="pb-4">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-secondary" />
                <span className="font-semibold text-card-foreground">
                  Level {profile?.level ?? 1} Progress
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {xpToNextLevel} XP to Level {(profile?.level ?? 1) + 1}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-secondary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="pb-8">
        <div className="container mx-auto px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-card-foreground">
                      {stat.value}
                      {stat.suffix && (
                        <span className="text-sm font-normal text-muted-foreground ml-1">
                          {stat.suffix}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                to: "/daily-tasks",
                icon: "🎯",
                title: "Daily Tasks",
                desc: "Complete coding challenges to earn XP",
                cta: "Start Tasks",
              },
              {
                to: "/roadmaps",
                icon: "🗺️",
                title: "Roadmaps",
                desc: "Follow structured learning paths",
                cta: "Browse Roadmaps",
              },
              {
                to: "/achievements",
                icon: "🏆",
                title: "Achievements",
                desc: "View your earned badges and milestones",
                cta: "View Badges",
              },
            ].map((item) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-card-hover transition-all duration-200"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold text-card-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                <Link to={item.to}>
                  <Button
                    size="sm"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-gold font-semibold"
                  >
                    {item.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
