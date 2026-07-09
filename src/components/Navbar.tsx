import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Compass, LayoutDashboard, LogOut, User,
  Shield, ChevronDown, BarChart3, Target, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// ── Avatar initials helper ────────────────────────────────────────────────────
const getInitials = (name?: string | null, email?: string | null) => {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  return email?.[0]?.toUpperCase() || "?";
};

// ── User avatar button ────────────────────────────────────────────────────────
interface UserMenuProps {
  displayName: string;
  email?: string;
  avatarUrl?: string | null;
  isAdmin: boolean;
  onSignOut: () => void;
  onClose?: () => void;
}

const UserMenu = ({ displayName, email, avatarUrl, isAdmin, onSignOut, onClose }: UserMenuProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const close = () => { setOpen(false); onClose?.(); };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-border/40 bg-card/80 px-2.5 py-1.5 hover:bg-muted/80 transition-all"
        id="btn-user-menu"
      >
        {/* Avatar */}
        <div className="h-7 w-7 rounded-full overflow-hidden border-2 border-secondary/30 flex items-center justify-center bg-gradient-to-br from-secondary to-accent text-secondary-foreground text-xs font-bold shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
          ) : (
            getInitials(displayName, email)
          )}
        </div>
        <span className="text-sm font-medium text-foreground max-w-[100px] truncate hidden sm:block">
          {displayName}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card shadow-card-hover overflow-hidden z-50"
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
              {email && <p className="text-xs text-muted-foreground truncate">{email}</p>}
              {isAdmin && (
                <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full">
                  <Shield className="h-2.5 w-2.5" /> Admin
                </span>
              )}
            </div>

            {/* Menu items */}
            <div className="py-1">
              {[
                { icon: LayoutDashboard, label: "Dashboard",     href: "/dashboard" },
                { icon: User,           label: "My Profile",     href: "/profile" },
                { icon: Sparkles,       label: "AI Roadmap",     href: "/ai-roadmap" },
                { icon: Target,         label: "Daily Tasks",    href: "/daily-tasks" },
                { icon: BarChart3,      label: "Progress",       href: "/progress" },
              ].map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={close}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/60 transition-colors"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  {item.label}
                </Link>
              ))}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={close}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Link>
              )}
            </div>

            <div className="border-t border-border py-1">
              <button
                onClick={() => { close(); onSignOut(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                id="btn-sign-out"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Navbar ────────────────────────────────────────────────────────────────────

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: "Home",       href: "/" },
    { label: "Services",   href: "/services" },
    { label: "Roadmaps",   href: "/roadmaps" },
    { label: "✨ AI Roadmap",href: "/ai-roadmap" },
    { label: "Contact",    href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      navigate("/");
    }
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.display_name ||
    user?.email?.split("@")[0] ||
    "User";

  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-xl"
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 shadow-glow">
            <Compass className="h-5 w-5 text-accent" />
          </div>
          <span className="text-xl font-bold font-display text-foreground">
            Skill<span className="text-gradient-cyan">Path</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? "text-accent bg-accent/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop auth section */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <UserMenu
              displayName={displayName}
              email={user.email}
              avatarUrl={avatarUrl}
              isAdmin={isAdmin}
              onSignOut={handleSignOut}
            />
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/auth">
                <Button
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow font-semibold"
                >
                  Get Started Free
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/30 bg-background/95 backdrop-blur-xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive(link.href) ? "text-accent bg-accent/10" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-3 pt-3 border-t border-border space-y-2">
                {user ? (
                  <>
                    {/* User info */}
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-muted/50">
                      <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-secondary to-accent text-secondary-foreground text-xs font-bold shrink-0">
                        {avatarUrl
                          ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                          : getInitials(displayName, user.email)
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>

                    {[
                      { label: "Dashboard",  href: "/dashboard" },
                      { label: "My Profile", href: "/profile" },
                      { label: "Daily Tasks", href: "/daily-tasks" },
                      ...(isAdmin ? [{ label: "Admin Panel", href: "/admin" }] : []),
                    ].map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="block rounded-lg px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => { setIsOpen(false); handleSignOut(); }}
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="w-full bg-accent text-accent-foreground shadow-glow font-semibold">
                      Get Started Free
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
