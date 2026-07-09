import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// ── Types ─────────────────────────────────────────────────────────────────────

export type UserRole = "user" | "admin" | "moderator" | null;

interface AuthContextType {
  // State
  session: Session | null;
  user: User | null;
  role: UserRole;
  loading: boolean;       // auth session loading
  roleLoading: boolean;   // role fetch loading (separate to avoid flash)
  isAdmin: boolean;       // derived: role === 'admin'
  isModerator: boolean;   // derived: role === 'moderator' || role === 'admin'

  // Email auth
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;

  // OAuth
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithGithub: () => Promise<{ error: Error | null }>;

  // Password reset
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser]       = useState<User | null>(null);
  const [role, setRole]       = useState<UserRole>(null);
  const [loading, setLoading]         = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);

  // ── Fetch role from DB via SECURITY DEFINER RPC ────────────────────────────
  // Using an RPC instead of a direct table read means the role is always
  // authoritative from the database — it cannot be forged client-side.
  const fetchRole = useCallback(async () => {
    setRoleLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_my_role");
      if (error) {
        console.warn("[AuthContext] Role fetch failed:", error.message);
        setRole("user"); // safe fallback
      } else {
        setRole((data as UserRole) ?? "user");
      }
    } catch {
      setRole("user");
    } finally {
      setRoleLoading(false);
    }
  }, []);

  // ── Session listener ───────────────────────────────────────────────────────
  useEffect(() => {
    // Get the initial session (handles page refresh / existing cookie)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) fetchRole();
    });

    // Subscribe to all future auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user) {
          // SIGNED_IN covers both email login and OAuth callback
          await fetchRole();
        } else {
          setRole(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── OAuth redirect origin ──────────────────────────────────────────────────
  // Uses the current origin so it works for both localhost and production.
  const getRedirectUrl = () => `${window.location.origin}/auth/callback`;

  // ── Auth methods ───────────────────────────────────────────────────────────

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getRedirectUrl(),
          data: {
            display_name: displayName?.trim() || email.split("@")[0],
          },
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      // Force clear the local session even if the server rejects it
      await supabase.auth.signOut({ scope: 'local' });
    } catch (err) {
      console.warn("SignOut error:", err);
    } finally {
      setRole(null);
      setUser(null);
      setSession(null);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getRedirectUrl(),
          queryParams: {
            // Request offline access so we get a refresh token
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithGithub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: getRedirectUrl(),
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  // ── Context value ──────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        role,
        loading,
        roleLoading,
        isAdmin: role === "admin",
        isModerator: role === "admin" || role === "moderator",
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
        signInWithGithub,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
