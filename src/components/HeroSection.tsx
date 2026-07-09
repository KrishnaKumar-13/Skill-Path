import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-hero pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Ambient glow orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-cyan/8 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-64 h-64 rounded-full bg-accent/5 blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: "1s" }} />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(hsl(190 90% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(190 90% 50%) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-cyan" />
              <span className="text-sm font-medium text-cyan">Personalized Learning Roadmaps</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Master Any Skill with a{" "}
              <span className="text-gradient-cyan">Clear Roadmap</span>
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-primary-foreground/60">
              Stop watching random tutorials. Get a structured, level-wise learning path with daily tasks,
              real-time challenges, and gamified progress tracking.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow text-base font-semibold px-8"
                >
                  Start Learning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/roadmaps">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/50 shadow-lg shadow-blue-900/40 text-base font-semibold px-8"
                >
                  Explore Roadmaps
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-8">
              {[
                { value: "50+", label: "Skill Paths" },
                { value: "10K+", label: "Learners" },
                { value: "95%", label: "Completion Rate" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-gradient-cyan">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="animate-float">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-accent/10 blur-2xl" />
                <img
                  src={heroImage}
                  alt="Learning roadmap illustration showing a winding path through floating islands with coding icons"
                  className="relative w-full rounded-2xl"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
