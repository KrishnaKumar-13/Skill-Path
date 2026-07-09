import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, BookOpen, Star, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { readingResources, ReadingResource, getLanguageKey } from "@/data/learningStyleData";

const TYPE_COLORS: Record<string, string> = {
  "Official Docs": "bg-blue-100 text-blue-800 border-blue-200",
  "Tutorial Site": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Book": "bg-purple-100 text-purple-800 border-purple-200",
  "Blog": "bg-orange-100 text-orange-800 border-orange-200",
  "Reference": "bg-slate-100 text-slate-700 border-slate-200",
};

const LEVEL_COLORS: Record<string, string> = {
  "Beginner": "text-green-600",
  "Intermediate": "text-yellow-600",
  "Advanced": "text-red-600",
  "All Levels": "text-blue-600",
};

const ResourceCard = ({ resource, index }: { resource: ReadingResource; index: number }) => (
  <motion.a
    href={resource.url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06 }}
    className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-accent/40"
  >
    <div className="flex items-start justify-between mb-3">
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${TYPE_COLORS[resource.type] || "bg-muted text-muted-foreground border-border"}`}>
        {resource.type}
      </span>
      <div className="flex items-center gap-2">
        {!resource.isFree && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" /> Paid
          </span>
        )}
        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>

    <h3 className="font-bold text-card-foreground mb-1 text-sm leading-snug group-hover:text-accent transition-colors">
      {resource.title}
    </h3>
    <p className="text-xs font-semibold text-accent mb-2">{resource.source}</p>
    <p className="text-xs text-muted-foreground flex-1 mb-4">{resource.description}</p>

    <div className="flex items-center gap-4 text-xs">
      <span className="flex items-center gap-1 text-muted-foreground">
        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
        {resource.rating}
      </span>
      <span className={`font-semibold ${LEVEL_COLORS[resource.level]}`}>
        {resource.level}
      </span>
      {resource.isFree && (
        <span className="text-green-600 font-semibold">Free</span>
      )}
    </div>

    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-accent group-hover:gap-3 transition-all">
      <BookOpen className="h-3.5 w-3.5" />
      Read Now
    </div>
  </motion.a>
);

const ReadingResources = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { langName?: string; langSlug?: string; langEmoji?: string } | null;

  const langName = state?.langName || "Python";
  const langSlug = state?.langSlug || "python";
  const langEmoji = state?.langEmoji || "🐍";
  const key = getLanguageKey(langSlug, langName);
  const resources = readingResources[key] || readingResources.python;

  const grouped = resources.reduce((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {} as Record<string, ReadingResource[]>);

  const typeOrder = ["Official Docs", "Tutorial Site", "Book", "Reference", "Blog"];
  const sortedTypes = typeOrder.filter(t => grouped[t]);

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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-2xl">
              {langEmoji}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {langName} — <span className="text-emerald-500">Reading Resources</span>
              </h1>
              <p className="text-muted-foreground text-sm">
                Official docs, books, and trusted tutorial sites — all free (unless marked)
              </p>
            </div>
          </div>
        </motion.div>

        {sortedTypes.map((type, sectionIdx) => (
          <section key={type} className="mb-10">
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sectionIdx * 0.1 }}
              className="text-xl font-bold text-foreground mb-5 flex items-center gap-2"
            >
              <span className={`px-3 py-1 rounded-full text-sm border ${TYPE_COLORS[type] || "bg-muted text-muted-foreground border-border"}`}>
                {type}
              </span>
              <span className="text-muted-foreground text-sm font-normal">{grouped[type].length} resources</span>
            </motion.h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[type].map((resource, i) => (
                <ResourceCard key={i} resource={resource} index={i + sectionIdx * 3} />
              ))}
            </div>
          </section>
        ))}

        <div className="mt-8 rounded-2xl border border-border bg-card/50 p-6 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Prefer video learning or hands-on projects?
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/videos", { state: { langName, langSlug, langEmoji } })}>
              📺 Watch Videos
            </Button>
            <Button variant="outline" onClick={() => navigate("/projects", { state: { langName, langSlug, langEmoji } })}>
              🛠️ Browse Projects
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReadingResources;
