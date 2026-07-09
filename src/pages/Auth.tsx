import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Compass, Mail, Lock, User, Eye, EyeOff,
  AlertCircle, CheckCircle2, ArrowLeft, Github
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────
type AuthMode = "login" | "signup" | "forgot" | "verify";

// ── Google icon (inline SVG for brand accuracy) ───────────────────────────────
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// ── Animated background dots ──────────────────────────────────────────────────
const DotGrid = () => (
  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
    backgroundImage: "radial-gradient(circle, hsl(40 95% 55%) 1px, transparent 1px)",
    backgroundSize: "32px 32px",
  }} />
);

// ── OR divider ─────────────────────────────────────────────────────────────────
const OrDivider = () => (
  <div className="relative flex items-center gap-3 my-1">
    <div className="flex-1 h-px bg-border" />
    <span className="text-xs text-muted-foreground font-medium px-1">OR</span>
    <div className="flex-1 h-px bg-border" />
  </div>
);

// ── Inline error banner ────────────────────────────────────────────────────────
const ErrorBanner = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive"
  >
    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
    <span>{message}</span>
  </motion.div>
);

// ── Spinner button loader ──────────────────────────────────────────────────────
const Spinner = () => (
  <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
);

// ── Main component ─────────────────────────────────────────────────────────────
const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const { signIn, signUp, signInWithGoogle, signInWithGithub, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to redirect after login (passed via router state from ProtectedRoute)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  // Reset errors when switching mode
  useEffect(() => { setErrorMsg(""); }, [mode]);

  // ── Form submit handler ─────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (mode === "signup" && !displayName.trim()) {
      setErrorMsg("Please enter your display name.");
      return;
    }
    if (mode !== "forgot" && password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(
          error.message.includes("Invalid login credentials")
            ? "Incorrect email or password. Please try again."
            : error.message
        );
      } else {
        toast.success("Welcome back! 👋");
        navigate(from, { replace: true });
      }

    } else if (mode === "signup") {
      const { error } = await signUp(email, password, displayName);
      if (error) {
        setErrorMsg(
          error.message.includes("already registered")
            ? "An account with this email already exists. Please log in."
            : error.message
        );
      } else {
        setMode("verify");
      }

    } else if (mode === "forgot") {
      const { error } = await resetPassword(email);
      if (error) {
        setErrorMsg(error.message);
      } else {
        setMode("verify");
      }
    }

    setIsSubmitting(false);
  };

  // ── Google OAuth ────────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setOauthLoading("google");
    setErrorMsg("");
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(error.message);
      setOauthLoading(null);
    }
    // On success: browser navigates to Google → comes back to /auth/callback
  };

  // ── GitHub OAuth ────────────────────────────────────────────────────────────
  const handleGithub = async () => {
    setOauthLoading("github");
    setErrorMsg("");
    const { error } = await signInWithGithub();
    if (error) {
      setErrorMsg(error.message);
      setOauthLoading(null);
    }
  };

  // ── Logo + brand ────────────────────────────────────────────────────────────
  const Brand = () => (
    <a href="/" className="inline-flex items-center gap-2 mb-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
        <Compass className="h-5 w-5 text-secondary-foreground" />
      </div>
      <span className="text-2xl font-bold font-display text-primary-foreground">
        Skill<span className="text-gradient-gold">Path</span>
      </span>
    </a>
  );

  // ── Render modes ────────────────────────────────────────────────────────────

  // ── Verify / Success screen ─────────────────────────────────────────────────
  if (mode === "verify") {
    return (
      <div className="min-h-screen bg-hero flex items-center justify-center px-6 py-12">
        <DotGrid />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md text-center"
        >
          <Brand />
          <div className="rounded-2xl border border-border/20 bg-card/95 backdrop-blur-xl p-10 shadow-card-hover">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-5">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-card-foreground mb-3">Check your email</h2>
            <p className="text-muted-foreground mb-2">
              We've sent a link to <strong className="text-foreground">{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              {email && password
                ? "Click the link to verify your account and complete sign-up."
                : "Click the link in the email to reset your password."}
            </p>
            <button
              onClick={() => setMode("login")}
              className="text-sm text-secondary hover:text-secondary/80 font-semibold transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Forgot password screen ──────────────────────────────────────────────────
  if (mode === "forgot") {
    return (
      <div className="min-h-screen bg-hero flex items-center justify-center px-6 py-12">
        <DotGrid />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="mb-8 text-center">
            <Brand />
            <h1 className="text-3xl font-bold text-primary-foreground mb-2">Forgot Password?</h1>
            <p className="text-primary-foreground/60">Enter your email and we'll send a reset link.</p>
          </div>

          <div className="rounded-2xl border border-border/20 bg-card/95 backdrop-blur-xl p-8 shadow-card-hover">
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && <ErrorBanner message={errorMsg} />}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-gold font-semibold"
                size="lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2"><Spinner /> Sending…</span>
                ) : "Send Reset Link"}
              </Button>
            </form>

            <button
              onClick={() => setMode("login")}
              className="mt-5 w-full flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Login / Signup screen ───────────────────────────────────────────────────
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center px-6 py-12">
      <DotGrid />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <Brand />
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-primary-foreground/60">
            {isLogin
              ? "Log in to continue your learning journey"
              : "Start learning and track your progress today"}
          </p>
        </div>

        <div className="rounded-2xl border border-border/20 bg-card/95 backdrop-blur-xl p-8 shadow-card-hover">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: isLogin ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 10 : -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* ── OAuth buttons ──────────────────────────────────── */}
              <div className="space-y-3 mb-5">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 font-medium border-border/60 hover:bg-muted/60 transition-all gap-3"
                  onClick={handleGoogle}
                  disabled={!!oauthLoading || isSubmitting}
                  id="btn-google-oauth"
                >
                  {oauthLoading === "google" ? (
                    <Spinner />
                  ) : (
                    <GoogleIcon />
                  )}
                  Continue with Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 font-medium border-border/60 hover:bg-muted/60 transition-all gap-3"
                  onClick={handleGithub}
                  disabled={!!oauthLoading || isSubmitting}
                  id="btn-github-oauth"
                >
                  {oauthLoading === "github" ? (
                    <Spinner />
                  ) : (
                    <Github className="h-5 w-5" />
                  )}
                  Continue with GitHub
                </Button>
              </div>

              <OrDivider />

              {/* ── Email/password form ───────────────────────────── */}
              <form onSubmit={handleSubmit} className="space-y-4 mt-5">
                {errorMsg && <ErrorBanner message={errorMsg} />}

                {/* Display name — signup only */}
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-card-foreground">Display Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="pl-10"
                        maxLength={100}
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-card-foreground">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      maxLength={255}
                      autoFocus={isLogin}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-card-foreground">Password</Label>
                    {isLogin && (
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
                        className="text-xs text-secondary hover:text-secondary/80 font-medium transition-colors"
                        id="btn-forgot-password"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={isLogin ? "••••••••" : "Min. 6 characters"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      minLength={6}
                      maxLength={128}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="text-xs text-muted-foreground">At least 6 characters</p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting || !!oauthLoading}
                  className="w-full h-11 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-gold font-semibold mt-2"
                  size="lg"
                  id="btn-auth-submit"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Spinner />
                      {isLogin ? "Signing in…" : "Creating account…"}
                    </span>
                  ) : (
                    isLogin ? "Sign In" : "Create Account"
                  )}
                </Button>
              </form>

              {/* Switch mode */}
              <div className="mt-6 text-center">
                <span className="text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  onClick={() => { setMode(isLogin ? "signup" : "login"); setErrorMsg(""); }}
                  className="text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors"
                  id="btn-toggle-mode"
                >
                  {isLogin ? "Sign up for free" : "Sign in"}
                </button>
              </div>

              {/* Terms note */}
              {!isLogin && (
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  By creating an account you agree to our{" "}
                  <span className="underline cursor-pointer hover:text-foreground">Terms of Service</span>
                  {" "}and{" "}
                  <span className="underline cursor-pointer hover:text-foreground">Privacy Policy</span>.
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
