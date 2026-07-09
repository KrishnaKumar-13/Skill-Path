import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { codingPlatforms, CodingPlatform, getLanguageKey } from "@/data/learningStyleData";

const DIFF_COLORS: Record<string, string> = {
  "Beginner": "bg-green-100 text-green-800 border-green-200",
  "Intermediate": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Advanced": "bg-red-100 text-red-800 border-red-200",
  "All Levels": "bg-blue-100 text-blue-800 border-blue-200",
};

const PlatformCard = ({ platform, index }: { platform: CodingPlatform; index: number }) => (
  <motion.a
    href={platform.url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06 }}
    className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-accent/40"
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-3xl">{platform.emoji}</span>
      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>

    <h3 className="font-bold text-card-foreground mb-1 text-base group-hover:text-accent transition-colors">
      {platform.name}
    </h3>
    <p className="text-xs text-muted-foreground mb-3 flex-1">{platform.description}</p>

    <div className="mb-3 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Problems/Challenges</span>
        <span className="font-semibold text-foreground">{platform.problemCount}</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Focus Area</span>
        <span className="font-semibold text-foreground">{platform.focus}</span>
      </div>
    </div>

    <div className="flex flex-wrap gap-2 mb-3">
      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${DIFF_COLORS[platform.difficulty]}`}>
        {platform.difficulty}
      </span>
      {platform.isFree && (
        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
          Free
        </span>
      )}
    </div>

    <div className="mt-auto">
      <p className="text-xs text-muted-foreground mb-1">Best for:</p>
      <p className="text-xs font-semibold text-accent">{platform.bestFor}</p>
    </div>

    <div className="mt-4 flex items-center justify-between">
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
        {platform.rating}
      </span>
      <span className="text-xs font-semibold text-accent group-hover:gap-3 transition-all flex items-center gap-1">
        Start Practicing <ExternalLink className="h-3 w-3" />
      </span>
    </div>
  </motion.a>
);

const CodingChallenges = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { langName?: string; langSlug?: string; langEmoji?: string } | null;

  const langName = state?.langName || "Python";
  const langSlug = state?.langSlug || "python";
  const langEmoji = state?.langEmoji || "🐍";
  const key = getLanguageKey(langSlug, langName);

  // Get language-specific + DSA platforms
  const langPlatforms = codingPlatforms[key] || codingPlatforms.python;
  const dsaPlatforms = codingPlatforms.dsa;

  // Deduplicate by name
  const allPlatforms = [
    ...langPlatforms,
    ...dsaPlatforms.filter(d => !langPlatforms.find(l => l.name === d.name)),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pb-20 pt-28 max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-2xl">
              {langEmoji}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {langName} — <span className="text-amber-500">Coding Challenges</span>
              </h1>
              <p className="text-muted-foreground text-sm">
                Best platforms to practice {langName} — from beginner-friendly to competitive
              </p>
            </div>
          </div>
        </motion.div>

        {/* Top recommendation banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-yellow-300/40 bg-yellow-50/50 dark:bg-yellow-950/20 p-5 flex items-start gap-4"
        >
          <Trophy className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-foreground text-sm mb-1">
              Recommended for {langName} placements in India:
            </p>
            <p className="text-sm text-muted-foreground">
              Start with <strong>LeetCode</strong> (algorithms) + <strong>HackerRank</strong> (domain tracks).
              Once comfortable, add <strong>Codeforces</strong> for competitive programming ratings.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {allPlatforms.map((platform, i) => (
            <PlatformCard key={platform.name} platform={platform} index={i} />
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card/50 p-6 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Ready to practice daily structured problems?
          </p>
          <Button onClick={() => navigate("/daily-tasks")}>
            🎯 Go to Daily Tasks
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CodingChallenges;
