import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute, AdminRoute, GuestRoute } from "@/components/ProtectedRoute";

// ── Pages ─────────────────────────────────────────────────────────────────────

// Public
import Index        from "./pages/Index";
import Services     from "./pages/Services";
import Contact      from "./pages/Contact";
import NotFound     from "./pages/NotFound";

// Auth (guest-only — redirect logged-in users away)
import Auth         from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import ResetPassword from "./pages/ResetPassword";

// Protected (requires login)
import Dashboard    from "./pages/Dashboard";
import Roadmaps     from "./pages/Roadmaps";
import RoadmapDetail from "./pages/RoadmapDetail";
import DailyTasks   from "./pages/DailyTasks";
import Achievements from "./pages/Achievements";
import Resources    from "./pages/Resources";
import ProgressTracker from "./pages/ProgressTracker";
import PersonalizedPaths from "./pages/PersonalizedPaths";
import Profile      from "./pages/Profile";
import AIRoadmap    from "./pages/AIRoadmap";

// Learning style result pages (protected)
import VideoTutorials  from "./pages/VideoTutorials";
import ReadingResources from "./pages/ReadingResources";
import ProjectIdeas    from "./pages/ProjectIdeas";
import CodingChallenges from "./pages/CodingChallenges";

// Admin only
import Admin from "./pages/Admin";

// ─────────────────────────────────────────────────────────────────────────────

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>

            {/* ── Public routes — no auth required ────────────────── */}
            <Route path="/"          element={<Index />} />
            <Route path="/services"  element={<Services />} />
            <Route path="/contact"   element={<Contact />} />

            {/* ── Auth routes — redirect logged-in users to /dashboard */}
            <Route path="/auth" element={
              <GuestRoute><Auth /></GuestRoute>
            } />

            {/* OAuth callback — no guard needed, handled internally */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Password reset — user is already authenticated via magic link */}
            <Route path="/auth/reset-password" element={<ResetPassword />} />

            {/* ── Protected routes — requires login ───────────────── */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/roadmaps" element={
              <ProtectedRoute><Roadmaps /></ProtectedRoute>
            } />
            <Route path="/roadmap/:slug" element={
              <ProtectedRoute><RoadmapDetail /></ProtectedRoute>
            } />
            <Route path="/daily-tasks" element={
              <ProtectedRoute><DailyTasks /></ProtectedRoute>
            } />
            <Route path="/achievements" element={
              <ProtectedRoute><Achievements /></ProtectedRoute>
            } />
            <Route path="/resources" element={
              <ProtectedRoute><Resources /></ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute><ProgressTracker /></ProtectedRoute>
            } />
            <Route path="/personalized" element={
              <ProtectedRoute><PersonalizedPaths /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/ai-roadmap" element={
              <ProtectedRoute><AIRoadmap /></ProtectedRoute>
            } />

            {/* Learning style result pages */}
            <Route path="/videos" element={
              <ProtectedRoute><VideoTutorials /></ProtectedRoute>
            } />
            <Route path="/reading" element={
              <ProtectedRoute><ReadingResources /></ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute><ProjectIdeas /></ProtectedRoute>
            } />
            <Route path="/challenges" element={
              <ProtectedRoute><CodingChallenges /></ProtectedRoute>
            } />

            {/* ── Admin only — requires login + admin role ─────────── */}
            <Route path="/admin" element={
              <AdminRoute><Admin /></AdminRoute>
            } />

            {/* ── 404 ─────────────────────────────────────────────── */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
