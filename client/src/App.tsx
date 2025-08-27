import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import Dashboard from "@/pages/dashboard";
import Course from "@/pages/course";
import AiTutor from "@/pages/ai-tutor";
import CodeEditor from "@/pages/code-editor";
import ErrorSolver from "@/pages/error-solver";
import Challenges from "@/pages/challenges";
import Community from "@/pages/community";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import NotFound from "@/pages/not-found";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show login page by default if not authenticated
  if (!isLoading && !isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route component={Login} />
      </Switch>
    );
  }

  // Show protected routes if authenticated
  return (
    <Switch>
      <Route path="/" component={() => (
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      )} />
      <Route path="/dashboard" component={() => (
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      )} />
      <Route path="/course" component={() => (
        <ProtectedRoute>
          <Layout><Course /></Layout>
        </ProtectedRoute>
      )} />
      <Route path="/ai-tutor" component={() => (
        <ProtectedRoute>
          <Layout><AiTutor /></Layout>
        </ProtectedRoute>
      )} />
      <Route path="/code-editor" component={() => (
        <ProtectedRoute>
          <Layout><CodeEditor /></Layout>
        </ProtectedRoute>
      )} />
      <Route path="/error-solver" component={() => (
        <ProtectedRoute>
          <Layout><ErrorSolver /></Layout>
        </ProtectedRoute>
      )} />
      <Route path="/challenges" component={() => (
        <ProtectedRoute>
          <Layout><Challenges /></Layout>
        </ProtectedRoute>
      )} />
      <Route path="/community" component={() => (
        <ProtectedRoute>
          <Layout><Community /></Layout>
        </ProtectedRoute>
      )} />
      <Route path="/profile" component={() => (
        <ProtectedRoute>
          <Layout><Profile /></Layout>
        </ProtectedRoute>
      )} />
      <Route path="/settings" component={() => (
        <ProtectedRoute>
          <Layout><Settings /></Layout>
        </ProtectedRoute>
      )} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
