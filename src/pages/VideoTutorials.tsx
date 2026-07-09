import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Play, Star, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { videoTutorials, VideoPlaylist, getLanguageKey } from "@/data/learningStyleData";

const LANGUAGE_FLAGS: Record<string, string> = {
  Telugu: "🇮🇳",
  Hindi: "🇮🇳",
  English: "🌐",
};

const LANGUAGE_COLORS: Record<string, string> = {
  Telugu: "bg-orange-100 text-orange-800 border-orange-200",
  Hindi: "bg-green-100 text-green-800 border-green-200",
  English: "bg-blue-100 text-blue-800 border-blue-200",
};

const VideoCard = ({ playlist, index }: { playlist: VideoPlaylist; index: number }) => (
  <motion.a
    href={playlist.url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06 }}
    className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-accent/40"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${LANGUAGE_COLORS[playlist.language]}`}>
          {LANGUAGE_FLAGS[playlist.language]} {playlist.language}
        </span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {playlist.level}
        </span>
      </div>
      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>

    <h3 className="font-bold text-card-foreground mb-1 text-sm leading-snug group-hover:text-accent transition-colors">
      {playlist.title}
    </h3>
    <p className="text-xs font-semibold text-accent mb-2">{playlist.channelName}</p>
    <p className="text-xs text-muted-foreground flex-1 mb-4">{playlist.description}</p>

    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
        {playlist.rating}
      </span>
      <span className="flex items-center gap-1">
        <Clock className="h-3 w-3" /> {playlist.durationHours}h
      </span>
      <span className="flex items-center gap-1">
        <Users className="h-3 w-3" /> {playlist.subscribers}
      </span>
    </div>

    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-accent group-hover:gap-3 transition-all">
      <Play className="h-3.5 w-3.5 fill-current" />
      Watch Playlist
    </div>
  </motion.a>
);

const VideoTutorials = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { langName?: string; langSlug?: string; langEmoji?: string } | null;

  const langName = state?.langName || "Python";
  const langSlug = state?.langSlug || "python";
  const langEmoji = state?.langEmoji || "🐍";
  const key = getLanguageKey(langSlug, langName);
  const playlists = videoTutorials[key] || videoTutorials.python;

  const byLanguage = {
    Telugu: playlists.filter(p => p.language === "Telugu"),
    Hindi: playlists.filter(p => p.language === "Hindi"),
    English: playlists.filter(p => p.language === "English"),
  };

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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-2xl">
              {langEmoji}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {langName} — <span className="text-red-500">Video Tutorials</span>
              </h1>
              <p className="text-muted-foreground text-sm">
                Curated YouTube playlists in Telugu, Hindi, and English
              </p>
            </div>
          </div>
        </motion.div>

        {(["Telugu", "Hindi", "English"] as const).map((lang, sectionIdx) => {
          const items = byLanguage[lang];
          if (items.length === 0) return null;
          return (
            <section key={lang} className="mb-12">
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: sectionIdx * 0.1 }}
                className="text-xl font-bold text-foreground mb-5 flex items-center gap-2"
              >
                <span className={`px-3 py-1 rounded-full text-sm border ${LANGUAGE_COLORS[lang]}`}>
                  {LANGUAGE_FLAGS[lang]} {lang}
                </span>
                <span className="text-muted-foreground text-sm font-normal">{items.length} playlists</span>
              </motion.h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((playlist, i) => (
                  <VideoCard key={i} playlist={playlist} index={i + sectionIdx * 3} />
                ))}
              </div>
            </section>
          );
        })}

        <div className="mt-8 rounded-2xl border border-border bg-card/50 p-6 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Want to follow a structured path instead?
          </p>
          <Button
            variant="outline"
            onClick={() => navigate(`/roadmap/${langSlug}`)}
            className="border-accent/40 text-accent hover:bg-accent/10"
          >
            View Full {langName} Roadmap →
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VideoTutorials;
