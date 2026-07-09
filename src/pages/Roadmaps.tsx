import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { useState } from "react";

const allRoadmaps = [
  { slug: "python", name: "Python", emoji: "🐍", color: "from-emerald to-emerald-light", levels: 8, hours: 120, learners: "3.2K", description: "From basics to advanced Python — web scraping, automation, APIs, and more.", category: "Programming" },
  { slug: "java", name: "Java", emoji: "☕", color: "from-secondary to-gold-light", levels: 9, hours: 150, learners: "2.5K", description: "Master OOP, Spring Boot, multithreading, and enterprise-grade Java development.", category: "Programming" },
  { slug: "cpp", name: "C++", emoji: "⚡", color: "from-blue-500 to-blue-300", levels: 10, hours: 160, learners: "1.8K", description: "Pointers, STL, competitive programming, and systems-level C++ mastery.", category: "Programming" },
  { slug: "react", name: "React.js", emoji: "⚛️", color: "from-cyan-500 to-cyan-300", levels: 7, hours: 100, learners: "2.8K", description: "Components, hooks, state management, and full-stack React applications.", category: "Web Development" },
  { slug: "web-development", name: "Web Development", emoji: "🌐", color: "from-violet-500 to-violet-300", levels: 10, hours: 200, learners: "4.1K", description: "HTML, CSS, JavaScript, and modern frameworks — the complete web dev journey.", category: "Web Development" },
  { slug: "backend", name: "Backend Development", emoji: "🖥️", color: "from-slate-500 to-slate-400", levels: 9, hours: 140, learners: "2.0K", description: "Node.js, databases, REST APIs, authentication, and server architecture.", category: "Web Development" },
  { slug: "deep-learning", name: "Deep Learning", emoji: "🧠", color: "from-pink-500 to-pink-300", levels: 10, hours: 180, learners: "1.4K", description: "Neural networks, CNNs, RNNs, GANs, and cutting-edge AI architectures.", category: "AI & Data" },
  { slug: "machine-learning", name: "Machine Learning", emoji: "🤖", color: "from-orange-500 to-orange-300", levels: 10, hours: 170, learners: "2.1K", description: "Supervised, unsupervised learning, model evaluation, and deployment.", category: "AI & Data" },
  { slug: "data-science", name: "Data Science", emoji: "📊", color: "from-teal-500 to-teal-300", levels: 10, hours: 160, learners: "1.9K", description: "Statistics, pandas, visualization, and real-world data analysis projects.", category: "AI & Data" },
  { slug: "cloud-computing", name: "Cloud Computing", emoji: "☁️", color: "from-sky-500 to-sky-300", levels: 8, hours: 130, learners: "1.8K", description: "AWS, Azure, GCP — deploy, scale, and manage cloud infrastructure.", category: "DevOps & Cloud" },
  { slug: "devops", name: "DevOps", emoji: "🔧", color: "from-amber-500 to-amber-300", levels: 9, hours: 140, learners: "1.5K", description: "CI/CD, Docker, Kubernetes, monitoring, and infrastructure as code.", category: "DevOps & Cloud" },
  { slug: "cybersecurity", name: "Cybersecurity", emoji: "🛡️", color: "from-red-500 to-red-300", levels: 8, hours: 130, learners: "1.2K", description: "Network security, ethical hacking, cryptography, and security best practices.", category: "DevOps & Cloud" },
];

const categories = ["All", "Programming", "Web Development", "AI & Data", "DevOps & Cloud"];

const Roadmaps = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = allRoadmaps.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BackButton />

      <section className="pt-32 pb-12 bg-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle, hsl(40 95% 55%) 1px, transparent 1px)",
          backgroundSize: "32px 32px"
        }} />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">
              Explore <span className="text-gradient-gold">Learning Roadmaps</span>
            </h1>
            <p className="text-lg text-primary-foreground/70 mb-8">
              Choose from 50+ structured paths across in-demand technical skills. Each roadmap guides you from beginner to professional.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search roadmaps..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 bg-card/90 backdrop-blur border-border/30 text-base"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-secondary text-secondary-foreground shadow-gold"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((roadmap, index) => (
              <motion.div
                key={roadmap.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/roadmap/${roadmap.slug}`} className="group block">
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 h-full">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-4xl">{roadmap.emoji}</span>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {roadmap.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground mb-2">{roadmap.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{roadmap.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{roadmap.hours}h</span>
                      <span>{roadmap.levels} levels</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{roadmap.learners}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-secondary group-hover:gap-3 transition-all">
                      View Roadmap <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No roadmaps found. Try a different search.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Roadmaps;
