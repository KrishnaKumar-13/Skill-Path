import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Edit3, Save, X, Camera, Zap, Flame, Trophy,
  Target, Award, Shield, CalendarDays, ArrowLeft, CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getProfile, getCompletionDates, getCompletionsByDifficulty, Profile } from "@/lib/api";
import { toast } from "sonner";

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({
  icon: Icon, label, value, suffix = "", color,
}: {
  icon: React.ElementType; label: string; value: string | number;
  suffix?: string; color: string;
}) => (
  <div className="rounded-xl border border-border bg-card p-4">
    <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <p className="text-2xl font-bold text-card-foreground">
      {value}<span className="text-sm font-normal text-muted-foreground ml-1">{suffix}</span>
    </p>
    <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
  </div>
);

// ── Badge chip ────────────────────────────────────────────────────────────────
const BadgeChip = ({ icon, label }: { icon: string; label: string }) => (
  <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
    <span className="text-xl">{icon}</span>
    <span className="text-sm font-medium text-card-foreground">{label}</span>
  </div>
);

// ── Avatar initials ───────────────────────────────────────────────────────────
const AvatarFallback = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-secondary to-accent text-secondary-foreground font-bold text-3xl">
      {initials}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const Profile = () => {
  const { user, isAdmin, role } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [diffStats, setDiffStats] = useState({ easy: 0, medium: 0, hard: 0 });
  const [activeDays, setActiveDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      Promise.all([
        getProfile(),
        getCompletionsByDifficulty(),
        getCompletionDates(),
      ]).then(([prof, diff, dates]) => {
        setProfile(prof);
        setDiffStats(diff);
        setActiveDays(dates.length);
        setEditName(prof?.display_name || "");
        setEditBio((prof as unknown as { bio?: string })?.bio || "");
      }).finally(() => setLoading(false));
    }
  }, [user]);

  // ── Save profile edits ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: editName.trim(), bio: editBio.trim() })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to save. Try again.");
    } else {
      setProfile(p => p ? { ...p, display_name: editName, bio: editBio } as Profile : p);
      setIsEditing(false);
      toast.success("Profile updated!");
    }
    setSaving(false);
  };

  // ── Avatar upload ────────────────────────────────────────────────────────────
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2MB");
      return;
    }

    const ext = file.name.split(".").pop();
    const path = `avatars/${user.id}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadErr) {
      toast.error("Upload failed: " + uploadErr.message);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);

    await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("user_id", user.id);

    setProfile(p => p ? { ...p, avatar_url: publicUrl } as Profile : p);
    toast.success("Avatar updated!");
  };

  // ── Computed values ──────────────────────────────────────────────────────────
  const displayName = profile?.display_name || user?.email?.split("@")[0] || "Learner";
  const xp = profile?.xp_points ?? 0;
  const level = profile?.level ?? 1;
  const xpInLevel = xp % 100;
  const totalSolved = diffStats.easy + diffStats.medium + diffStats.hard;

  // Determine earned badges
  const earnedBadges = [
    totalSolved >= 1   && { icon: "🎯", label: "First Question" },
    totalSolved >= 10  && { icon: "🔥", label: "10 Questions" },
    totalSolved >= 50  && { icon: "💎", label: "50 Questions" },
    (profile?.streak_days ?? 0) >= 3  && { icon: "⚡", label: "3-Day Streak" },
    (profile?.streak_days ?? 0) >= 7  && { icon: "🏆", label: "Week Streak" },
    xp >= 100  && { icon: "🌟", label: "100 XP" },
    xp >= 500  && { icon: "🚀", label: "500 XP" },
    isAdmin    && { icon: "🛡️", label: "Admin" },
  ].filter(Boolean) as { icon: string; label: string }[];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-muted border-t-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pb-20 pt-28 max-w-4xl">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        {/* ── Profile Header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-secondary/20 shadow-lg">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <AvatarFallback name={displayName} />
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/90 transition-colors"
                title="Change avatar"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1">Display Name</Label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-9 font-semibold"
                      maxLength={100}
                      autoFocus
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1">Bio</Label>
                    <Input
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Tell us about yourself…"
                      className="h-9"
                      maxLength={200}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-2xl font-bold text-card-foreground">{displayName}</h1>
                    {isAdmin && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        <Shield className="h-3 w-3" /> Admin
                      </span>
                    )}
                    {!isAdmin && role && (
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full capitalize">
                        {role}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-1">
                    <Mail className="h-3.5 w-3.5" />
                    {user?.email}
                  </p>
                  {(profile as unknown as { bio?: string })?.bio && (
                    <p className="text-sm text-muted-foreground">
                      {(profile as unknown as { bio?: string }).bio}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    Member since {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
                      : "—"}
                  </p>
                </>
              )}
            </div>

            {/* Edit button */}
            <div className="flex gap-2 shrink-0">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1">
                    <Save className="h-3.5 w-3.5" />
                    {saving ? "Saving…" : "Save"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} className="gap-1">
                    <X className="h-3.5 w-3.5" /> Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="gap-1.5">
                  <Edit3 className="h-3.5 w-3.5" /> Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* XP level bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold flex items-center gap-1 text-card-foreground">
                <Zap className="h-4 w-4 text-secondary" /> Level {level}
              </span>
              <span className="text-muted-foreground">{xpInLevel}/100 XP to Level {level + 1}</span>
            </div>
            <Progress value={xpInLevel} className="h-2.5" />
          </div>
        </motion.div>

        {/* ── Stats Grid ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        >
          <StatCard icon={Zap}         label="Total XP"     value={xp}                   suffix="XP"   color="text-secondary bg-secondary/10" />
          <StatCard icon={Trophy}      label="Questions Done" value={totalSolved}                       color="text-emerald-500 bg-emerald-500/10" />
          <StatCard icon={Flame}       label="Current Streak" value={profile?.streak_days ?? 0} suffix="days" color="text-orange-500 bg-orange-500/10" />
          <StatCard icon={CalendarDays} label="Active Days"  value={activeDays}                        color="text-blue-500 bg-blue-500/10" />
        </motion.div>

        {/* ── Difficulty Breakdown ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-5 mb-6"
        >
          <h2 className="font-bold text-card-foreground mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" /> Questions by Difficulty
          </h2>
          <div className="space-y-3">
            {[
              { label: "Easy",   value: diffStats.easy,   color: "bg-green-500",  text: "text-green-600"  },
              { label: "Medium", value: diffStats.medium, color: "bg-yellow-500", text: "text-yellow-600" },
              { label: "Hard",   value: diffStats.hard,   color: "bg-red-500",    text: "text-red-600"    },
            ].map(row => {
              const pct = totalSolved > 0 ? Math.round((row.value / totalSolved) * 100) : 0;
              return (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className={`font-semibold ${row.text}`}>{row.label}</span>
                    <span className="text-muted-foreground">{row.value} solved ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      className={`h-full rounded-full ${row.color}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Badges ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <h2 className="font-bold text-card-foreground mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary" /> Badges & Achievements
          </h2>
          {earnedBadges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map(badge => (
                <BadgeChip key={badge.label} icon={badge.icon} label={badge.label} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Complete your first daily task to earn a badge!</p>
              <Link to="/daily-tasks" className="text-sm text-secondary font-semibold hover:text-secondary/80 mt-2 inline-block">
                Go to Daily Tasks →
              </Link>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
