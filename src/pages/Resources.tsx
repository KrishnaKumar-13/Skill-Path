import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, ExternalLink, Play, FileText, BookOpen, ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";

interface Resource {
  id: string;
  title: string;
  platform: string;
  type: "video" | "article" | "docs" | "course";
  url: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const resources: Resource[] = [
  { id: "1", title: "Python for Beginners - Full Course", platform: "YouTube (freeCodeCamp)", type: "video", url: "https://youtu.be/t2_Q2BRzeEE?si=opqTEXCvdps209gY", category: "Python", difficulty: "Beginner" },
  { id: "2", title: "Official Python Documentation", platform: "python.org", type: "docs", url: "https://docs.python.org/3/tutorial/index.html", category: "Python", difficulty: "Beginner" },
  { id: "3", title: "JavaScript: The Definitive Guide", platform: "MDN Web Docs", type: "docs", url: "https://developer.mozilla.org", category: "Web Dev", difficulty: "Intermediate" },
  { id: "4", title: "React Official Tutorial", platform: "react.dev", type: "docs", url: "https://react.dev/learn", category: "React", difficulty: "Beginner" },
  { id: "5", title: "C++ Language", platform: "Harvard / YouTube", type: "course", url: "https://youtu.be/j8nAHeVKL08?si=No0yJuOtMGmkB2ZY", category: "CS Fundamentals", difficulty: "Beginner" },
  { id: "6", title: "Deep Learning Specialization", platform: "Coursera (Andrew Ng)", type: "course", url: "https://coursera.org", category: "Deep Learning", difficulty: "Intermediate" },
  { id: "7", title: "Docker & Kubernetes: The Practical Guide", platform: "Udemy", type: "course", url: "https://udemy.com", category: "DevOps", difficulty: "Intermediate" },
  { id: "8", title: "System Design Interview Guide", platform: "Blog Article", type: "article", url: "#", category: "Backend", difficulty: "Advanced" },
  { id: "9", title: "Devops", platform: "YouTube (Traversy Media)", type: "video", url: "https://youtu.be/6reHmbSQGfY?si=avPcBR9ok7tRNq-X", category: "DevOps", difficulty: "Beginner" },
  { id: "10", title: "Machine Learning with Scikit-Learn", platform: "scikit-learn.org", type: "docs", url: "https://scikit-learn.org", category: "Machine Learning", difficulty: "Intermediate" },
  { id: "11", title: "AWS Cloud Practitioner Essentials", platform: "AWS Training", type: "course", url: "https://aws.amazon.com", category: "Cloud Computing", difficulty: "Beginner" },
  { id: "12", title: "The Rust Programming Language Book", platform: "doc.rust-lang.org", type: "docs", url: "https://doc.rust-lang.org", category: "Rust", difficulty: "Intermediate" },
];

const typeIcons: Record<string, React.ElementType> = {
  video: Play,
  article: FileText,
  docs: BookOpen,
  course: Brain,
};

const typeColors: Record<string, string> = {
  video: "text-destructive bg-destructive/10",
  article: "text-accent bg-accent/10",
  docs: "text-primary bg-primary/10",
  course: "text-secondary bg-secondary/10",
};

const Resources = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(resources.map((r) => r.category))];

  const filtered = resources.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === "All" || r.category === selectedCategory;
    return matchSearch && matchCategory;
  });

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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <Brain className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Curated Resources</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">Hand-picked learning materials from the best platforms — videos, docs, courses, and articles, all in one place.</p>
        </motion.div>

        {/* Search & Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resource Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource, i) => {
            const Icon = typeIcons[resource.type];
            return (
              <motion.a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-secondary/40"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeColors[resource.type]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-card-foreground text-sm mb-1 group-hover:text-secondary transition-colors">
                      {resource.title}
                      <ExternalLink className="ml-1 inline h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">{resource.platform}</p>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{resource.category}</span>
                      <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{resource.difficulty}</span>
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">No resources found. Try a different search term.</div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
