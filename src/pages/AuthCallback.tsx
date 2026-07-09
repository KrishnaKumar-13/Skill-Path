import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Compass } from "lucide-react";

/**
 * AuthCallback — handles the redirect from Google / GitHub OAuth.
 *
 * Supabase redirects back to /auth/callback with a code in the URL.
 * This page exchanges that code for a session, then navigates to /dashboard.
 *
 * Also handles the password reset redirect (type=recovery in URL).
 */
const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase automatically parses the URL hash / query params and sets the session.
    // We just need to wait for the onAuthStateChange event, then redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          navigate("/dashboard", { replace: true });
        } else if (event === "PASSWORD_RECOVERY") {
          // Redirect to the reset password page (still authenticated)
          navigate("/auth/reset-password", { replace: true });
        } else if (!session) {
          // Something went wrong — send back to login
          navigate("/auth", { replace: true });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-t-white animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Compass className="h-8 w-8 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Signing you in…</h2>
          <p className="text-white/60 text-sm">Completing authentication</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
