import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 bg-hero relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan/5 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5">
            <Zap className="h-4 w-4 text-cyan" />
            <span className="text-sm font-medium text-cyan">Start your journey today</span>
          </div>

          <h2 className="mb-6 text-3xl font-bold text-primary-foreground sm:text-5xl">
            Ready to Transform Your{" "}
            <span className="text-gradient-cyan">Learning Journey</span>?
          </h2>

          <p className="mb-10 text-lg text-primary-foreground/60">
            Join thousands of students who've gone from confused beginners to confident, industry-ready professionals with SkillPath.
          </p>

          <Link to="/auth">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow text-base font-semibold px-10 py-6"
            >
              Get Started — It's Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <p className="mt-4 text-sm text-primary-foreground/30">No credit card required · Free forever plan available</p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
