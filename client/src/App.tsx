import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
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
  return (
    <Switch>
      <Route path="/" component={() => <Layout><Dashboard /></Layout>} />
      <Route path="/course" component={() => <Layout><Course /></Layout>} />
      <Route path="/ai-tutor" component={() => <Layout><AiTutor /></Layout>} />
      <Route path="/code-editor" component={() => <Layout><CodeEditor /></Layout>} />
      <Route path="/error-solver" component={() => <Layout><ErrorSolver /></Layout>} />
      <Route path="/challenges" component={() => <Layout><Challenges /></Layout>} />
      <Route path="/community" component={() => <Layout><Community /></Layout>} />
      <Route path="/profile" component={() => <Layout><Profile /></Layout>} />
      <Route path="/settings" component={() => <Layout><Settings /></Layout>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
