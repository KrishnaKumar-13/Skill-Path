import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Clock, Code2, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { projectIdeas, ProjectIdea, getLanguageKey } from "@/data/learningStyleData";

const DIFF_CONFIG = {
  Beginner: { color: "bg-green-100 text-green-800 border-green-200", badge: "bg-green-500", label: "🟢 Beginner" },
  Intermediate: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", badge: "bg-yellow-500", label: "🟡 Intermediate" },
  Advanced: { color: "bg-red-100 text-red-800 border-red-200", badge: "bg-red-500", label: "🔴 Advanced" },
};

const ProjectCard = ({ project, index }: { project: ProjectIdea; index: number }) => {
  const diff = DIFF_CONFIG[project.difficulty];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${diff.color}`}>
          {diff.label}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" /> ~{project.estimatedHours}h
        </span>
      </div>

      <h3 className="font-bold text-card-foreground mb-1 text-base">{project.name}</h3>
      <p className="text-xs text-muted-foreground mb-3 flex-1">{project.description}</p>

      <div className="mb-3">
        <p className="text-xs font-semibold text-foreground mb-1.5">Why build this?</p>
        <p className="text-xs text-muted-foreground italic">{project.why}</p>
      </div>

      <div className="mb-3">
        <p className="text-xs font-semibold text-foreground mb-1.5">Skills you'll learn:</p>
        <div className="flex flex-wrap gap-1">
          {project.skills.map(skill => (
            <span key={skill} className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-foreground mb-1.5">Tech stack:</p>
        <div className="flex flex-wrap gap-1">
          {project.techStack.map(tech => (
            <span key={tech} className="bg-accent/10 text-accent text-[10px] px-2 py-0.5 rounded-full font-medium">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {project.githubExample && (
        <a
          href={project.githubExample}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center gap-2 text-xs font-semibold text-foreground/60 hover:text-foreground transition-colors"
        >
          <Github className="h-3.5 w-3.5" />
          View GitHub Examples
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </motion.div>
  );
};

const ProjectIdeas = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { langName?: string; langSlug?: string; langEmoji?: string } | null;

  const langName = state?.langName || "Python";
  const langSlug = state?.langSlug || "python";
  const langEmoji = state?.langEmoji || "🐍";
  const key = getLanguageKey(langSlug, langName);
  const projects = projectIdeas[key] || projectIdeas.python;

  const grouped = {
    Beginner: projects.filter(p => p.difficulty === "Beginner"),
    Intermediate: projects.filter(p => p.difficulty === "Intermediate"),
    Advanced: projects.filter(p => p.difficulty === "Advanced"),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pb-20 pt-28 max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl">
              {langEmoji}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {langName} — <span className="text-violet-500">Project Ideas</span>
              </h1>
              <p className="text-muted-foreground text-sm">
                Real projects sorted by difficulty — with estimated time, skills, and GitHub examples
              </p>
            </div>
          </div>
        </motion.div>

        {(["Beginner", "Intermediate", "Advanced"] as const).map((diff, sectionIdx) => {
          const items = grouped[diff];
          if (items.length === 0) return null;
          const cfg = DIFF_CONFIG[diff];
          return (
            <section key={diff} className="mb-12">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: sectionIdx * 0.1 }}
                className="flex items-center gap-3 mb-5"
              >
                <h2 className="text-xl font-bold text-foreground">{cfg.label} Projects</h2>
                <span className="text-muted-foreground text-sm">{items.length} ideas</span>
              </motion.div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((project, i) => (
                  <ProjectCard key={i} project={project} index={i + sectionIdx * 3} />
                ))}
              </div>
            </section>
          );
        })}

        <div className="mt-8 rounded-2xl border border-dashed border-secondary/40 bg-secondary/5 p-6 text-center">
          <Code2 className="h-8 w-8 text-secondary mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-2">Pro tip: Build all 3 levels</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start with a Beginner project, expand it to Intermediate, then rebuild it with an Advanced architecture.
            That's one project showing your full growth arc — interviewers love it.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate(`/roadmap/${langSlug}`)}
            className="border-secondary/40 text-secondary hover:bg-secondary/10"
          >
            Follow the {langName} Roadmap →
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectIdeas;
