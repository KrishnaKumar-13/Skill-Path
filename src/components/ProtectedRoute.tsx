import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Compass } from "lucide-react";

// ── Shared loading spinner ────────────────────────────────────────────────────
const AuthSpinner = ({ message = "Loading..." }: { message?: string }) => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="relative mx-auto w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-muted animate-pulse" />
        <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Compass className="h-6 w-6 text-primary" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium">{message}</p>
    </div>
  </div>
);

// ── ProtectedRoute ────────────────────────────────────────────────────────────
// Redirects unauthenticated users to /auth, preserving the intended destination
// so after login they are sent back to where they tried to go.

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthSpinner message="Restoring your session..." />;
  }

  if (!user) {
    // Pass the intended route as state so Auth can redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// ── AdminRoute ────────────────────────────────────────────────────────────────
// Layered on top of ProtectedRoute — also checks role === 'admin'.
// Shows a dedicated loading state while role is being fetched from DB.

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, loading, isAdmin, roleLoading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthSpinner message="Restoring your session..." />;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (roleLoading) {
    return <AuthSpinner message="Verifying admin access..." />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// ── GuestRoute ────────────────────────────────────────────────────────────────
// Redirects already-authenticated users away from /auth (to /dashboard).
// Prevents logged-in users from seeing the login page.

interface GuestRouteProps {
  children: ReactNode;
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <AuthSpinner message="Loading..." />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
