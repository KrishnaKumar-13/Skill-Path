import { motion } from "framer-motion";
import { UserPlus, Route, Rocket } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Choose Your Skill",
    description: "Pick any technical skill — from Python to Cloud Computing. Tell us your current level and goals.",
  },
  {
    icon: Route,
    number: "02",
    title: "Get Your Roadmap",
    description: "Receive a personalized, level-wise roadmap with curated resources, daily tasks, and milestones.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Learn & Level Up",
    description: "Complete challenges, earn rewards, track progress, and transform into an industry-ready professional.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-muted/50 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-accent">
            How It Works
          </span>
          <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            Three Steps to{" "}
            <span className="text-gradient-cyan">Mastery</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Getting started is simple. Your structured learning journey begins in minutes.
          </p>
        </motion.div>

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connecting line */}
          <div className="absolute top-16 left-[16.6%] right-[16.6%] hidden h-0.5 bg-gradient-to-r from-accent via-emerald to-accent md:block opacity-40" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-glow animate-glow-pulse">
                <step.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <span className="mb-2 text-sm font-bold text-accent">{step.number}</span>
              <h3 className="mb-3 text-xl font-bold text-foreground">{step.title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
