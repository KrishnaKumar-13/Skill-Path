import { motion } from "framer-motion";
import { Code2, GraduationCap, Lightbulb, Users, Cpu, Shield, Rocket, BarChart3, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";

const services = [
  { icon: Code2, title: "Structured Learning Paths", description: "Expert-crafted roadmaps guide you from zero to proficiency with clear milestones at every level." },
  { icon: Lightbulb, title: "AI-Powered Recommendations", description: "Smart suggestions that adapt to your learning style, pace, and career goals in real-time." },
  { icon: Users, title: "Community Support", description: "Connect with fellow learners, share progress, collaborate on projects, and grow together." },
  { icon: Cpu, title: "Hands-On Projects", description: "Real-world projects at every level so you build portfolio-worthy work as you learn." },
  { icon: Shield, title: "Industry-Ready Skills", description: "Curriculum aligned with what top companies actually look for in engineering candidates." },
  { icon: Rocket, title: "Career Acceleration", description: "Interview prep, resume tips, and job-relevant skill tracking to fast-track your career." },
  { icon: BarChart3, title: "Progress Analytics", description: "Detailed dashboards to visualize your learning journey, streaks, and skill growth over time." },
  { icon: Zap, title: "Daily Challenges", description: "Fresh coding challenges every day tailored to your level to build consistency and depth." },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BackButton />

      <section className="relative pt-32 pb-20 bg-hero overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-cyan/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl text-center mb-16"
          >
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-cyan">Our Services</span>
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground sm:text-5xl">
              Everything You Need to <span className="text-gradient-cyan">Succeed</span>
            </h1>
            <p className="text-lg text-primary-foreground/60">
              A comprehensive suite of tools and resources designed to make your learning journey effective and enjoyable.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group glow-border rounded-2xl glass-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-cyan/10 transition-all duration-300 group-hover:bg-cyan/20 group-hover:shadow-glow">
                  <service.icon className="h-7 w-7 text-cyan transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-primary-foreground">{service.title}</h3>
                <p className="text-sm leading-relaxed text-primary-foreground/50">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
