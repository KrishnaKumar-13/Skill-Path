import { motion } from "framer-motion";
import { Code2, GraduationCap, Lightbulb, Users, Cpu, Shield } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Structured Learning Paths",
    description: "Expert-crafted roadmaps that guide you from zero to proficiency with clear milestones.",
  },
  {
    icon: GraduationCap,
    title: "Skill Certification",
    description: "Earn verifiable badges and certificates as you complete levels and master topics.",
  },
  {
    icon: Lightbulb,
    title: "AI-Powered Recommendations",
    description: "Smart suggestions that adapt to your learning style, pace, and career goals.",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with fellow learners, share progress, and collaborate on projects.",
  },
  {
    icon: Cpu,
    title: "Hands-On Projects",
    description: "Real-world projects at every level so you build portfolio-worthy work as you learn.",
  },
  {
    icon: Shield,
    title: "Industry-Ready Skills",
    description: "Curriculum aligned with what top companies actually look for in candidates.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-hero relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan/5 blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-cyan">
            Services
          </span>
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
            What We <span className="text-gradient-cyan">Offer</span>
          </h2>
          <p className="text-lg text-primary-foreground/60">
            Everything you need to accelerate your tech career, all in one platform.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={item}
              className="group glow-border rounded-2xl glass-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow cursor-default"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/10 transition-all duration-300 group-hover:bg-cyan/20 group-hover:shadow-glow">
                <service.icon className="h-6 w-6 text-cyan transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-primary-foreground">{service.title}</h3>
              <p className="text-sm leading-relaxed text-primary-foreground/50">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
