import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BackButton />

      <section className="relative pt-32 pb-20 bg-hero overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-cyan/5 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl text-center mb-16">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-wider text-cyan">Contact</span>
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground sm:text-5xl">
              Get in <span className="text-gradient-cyan">Touch</span>
            </h1>
            <p className="text-lg text-primary-foreground/60">Have questions? We'd love to hear from you.</p>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-2 max-w-5xl mx-auto">
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-5 glass-card rounded-2xl p-8"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-primary-foreground/70">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                  className="bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-primary-foreground/70">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  className="bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-primary-foreground/70">Message</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your message..."
                  rows={5}
                  required
                  className="bg-primary-foreground/5 border-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/30"
                />
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow font-semibold">
                <Send className="mr-2 h-4 w-4" /> Send Message
              </Button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-6"
            >
              {[
                { icon: Mail, title: "Email Us", detail: "support@skillpath.dev" },
                { icon: MapPin, title: "Location", detail: "San Francisco, CA" },
                { icon: MessageCircle, title: "Live Chat", detail: "Available Mon-Fri, 9am-5pm PST" },
              ].map((item, i) => (
                <div key={item.title} className="glass-card rounded-2xl p-6 flex items-start gap-4 transition-all duration-300 hover:shadow-glow">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan/10">
                    <item.icon className="h-6 w-6 text-cyan" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">{item.title}</h3>
                    <p className="text-sm text-primary-foreground/50">{item.detail}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
