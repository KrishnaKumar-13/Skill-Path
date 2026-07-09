import { Compass } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
              <Compass className="h-4 w-4 text-accent" />
            </div>
            <span className="text-lg font-bold font-display text-foreground">
              Skill<span className="text-gradient-cyan">Path</span>
            </span>
          </Link>

          <div className="flex flex-wrap justify-center gap-8">
            {[
              { label: "Features", href: "/#features" },
              { label: "Services", href: "/services" },
              { label: "Roadmaps", href: "/roadmaps" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link key={link.label} to={link.href} className="text-sm text-muted-foreground transition-colors hover:text-accent">
                {link.label}
              </Link>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            © 2026 SkillPath. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
