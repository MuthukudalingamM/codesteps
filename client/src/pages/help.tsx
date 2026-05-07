import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  HelpCircle, Search, ChevronDown, ChevronUp, BookOpen, Brain,
  Code, Bug, Trophy, MessageCircle, Mail, ExternalLink, Zap, Settings
} from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    icon: BookOpen,
    color: "text-green-500",
    questions: [
      {
        q: "How do I start learning JavaScript?",
        a: "Go to the Course page and select the Beginner level. Click on any lesson to open it and start reading. Each lesson includes a code example you can copy and try in your browser console."
      },
      {
        q: "Do I need to install anything?",
        a: "No — everything runs in the browser. You can practice code directly in the built-in Code Editor, or open your browser's developer console (press F12) to try examples from the lessons."
      },
      {
        q: "What order should I follow the lessons in?",
        a: "Start with Beginner lessons and work through them in order (1→20). Each lesson builds on the previous one. Once you feel confident, move to Intermediate, then Advanced, then Expert."
      },
    ]
  },
  {
    category: "AI Tutor",
    icon: Brain,
    color: "text-blue-500",
    questions: [
      {
        q: "Why does the AI assistant say it's unavailable?",
        a: "This usually happens if you're not logged in, or if there was a brief network error. Try refreshing the page and logging in again. The AI works best when you're authenticated."
      },
      {
        q: "Can I ask the AI anything about programming?",
        a: "Yes! The AI tutor is trained to help with JavaScript questions, explain concepts, debug code, and suggest what to learn next. Just type your question in the chat box on the AI Tutor page."
      },
      {
        q: "The AI's response was cut off — what happened?",
        a: "Long responses sometimes get trimmed. Try asking the AI to 'continue' or to explain a specific part in more detail. Shorter, focused questions tend to get the best answers."
      },
    ]
  },
  {
    category: "Code Editor",
    icon: Code,
    color: "text-purple-500",
    questions: [
      {
        q: "How do I run my code?",
        a: "Open the Code Editor page, type your JavaScript code, and click the Run button. The output appears in the panel below. You can also ask the AI to explain any errors automatically."
      },
      {
        q: "Can I save my code?",
        a: "Your code session is saved while you're on the page. For permanent storage, use the Copy button to save your code to a local file, or paste it into a service like GitHub Gist."
      },
    ]
  },
  {
    category: "Error Solver",
    icon: Bug,
    color: "text-red-500",
    questions: [
      {
        q: "How do I use the Error Solver?",
        a: "Go to the Error Solver page, paste the error message and the code that caused it, then click Analyze. The AI will explain what went wrong and suggest how to fix it."
      },
      {
        q: "What kinds of errors can it help with?",
        a: "It handles JavaScript runtime errors, syntax errors, logic bugs, and common library errors. It works best when you provide both the error message and the relevant code snippet."
      },
    ]
  },
  {
    category: "Challenges",
    icon: Trophy,
    color: "text-yellow-500",
    questions: [
      {
        q: "How do challenges work?",
        a: "Each challenge gives you a programming problem to solve. Write your solution in the editor and submit it. The system checks your answer against test cases and tells you if it passes."
      },
      {
        q: "I'm stuck on a challenge — what can I do?",
        a: "Click 'Show Hint' to get a nudge in the right direction. You can also ask the AI Tutor for help — paste the challenge description and your attempt and ask for guidance."
      },
    ]
  },
  {
    category: "Account & Settings",
    icon: Settings,
    color: "text-gray-500",
    questions: [
      {
        q: "I forgot my password — how do I reset it?",
        a: "On the login page, click 'Forgot your password?' and enter your email. You'll receive a verification code to set a new password."
      },
      {
        q: "How do I change my email or username?",
        a: "Go to the Settings page from the sidebar. You can update your display name, email, and notification preferences there."
      },
      {
        q: "How do I track my learning progress?",
        a: "Your progress is shown on the Dashboard and in your Profile page. It tracks lessons completed, challenges solved, and your current streak."
      },
    ]
  },
];

const quickLinks = [
  { label: "Start Beginner Course", href: "/course", icon: BookOpen, color: "text-green-500 bg-green-500/10" },
  { label: "Ask the AI Tutor", href: "/ai-tutor", icon: Brain, color: "text-blue-500 bg-blue-500/10" },
  { label: "Open Code Editor", href: "/code-editor", icon: Code, color: "text-purple-500 bg-purple-500/10" },
  { label: "Solve a Challenge", href: "/challenges", icon: Trophy, color: "text-yellow-500 bg-yellow-500/10" },
  { label: "Analyze an Error", href: "/error-solver", icon: Bug, color: "text-red-500 bg-red-500/10" },
  { label: "Join Community", href: "/community", icon: MessageCircle, color: "text-pink-500 bg-pink-500/10" },
];

export default function Help() {
  const [search, setSearch] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));

  const filteredFaqs = faqs.map(section => ({
    ...section,
    questions: section.questions.filter(
      ({ q, a }) =>
        search === "" ||
        q.toLowerCase().includes(search.toLowerCase()) ||
        a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(s => s.questions.length > 0);

  return (
    <div className="p-4 lg:p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="flex justify-center">
          <div className="p-3 bg-primary/10 rounded-full">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Find answers to common questions, or reach out if you need extra help.
        </p>

        {/* Search */}
        <div className="relative max-w-md mx-auto mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Quick Links */}
      {search === "" && (
        <div>
          <h2 className="text-lg font-semibold mb-3 text-foreground">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickLinks.map(({ label, href, icon: Icon, color }) => (
              <a key={href} href={href}>
                <Card className="cursor-pointer hover:shadow-md transition-all hover:border-primary/30 h-full">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className={`p-2 rounded-lg ${color.split(" ")[1]}`}>
                      <Icon className={`h-4 w-4 ${color.split(" ")[0]}`} />
                    </div>
                    <span className="text-sm font-medium">{label}</span>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Sections */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-foreground">
          {search ? `Results for "${search}"` : "Frequently Asked Questions"}
        </h2>

        {filteredFaqs.length === 0 && (
          <Card>
            <CardContent className="text-center py-10 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p>No results found for "<strong>{search}</strong>"</p>
              <p className="text-sm mt-1">Try different keywords or browse the sections below.</p>
              <Button variant="outline" className="mt-4" onClick={() => setSearch("")}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}

        {filteredFaqs.map(section => {
          const Icon = section.icon;
          return (
            <div key={section.category}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`h-5 w-5 ${section.color}`} />
                <h3 className="font-semibold text-foreground">{section.category}</h3>
                <Badge variant="secondary">{section.questions.length}</Badge>
              </div>
              <div className="space-y-2">
                {section.questions.map(({ q, a }) => {
                  const key = `${section.category}-${q}`;
                  const isOpen = openItems[key];
                  return (
                    <Card key={key} className="overflow-hidden">
                      <button
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:bg-muted/40 transition-colors"
                        onClick={() => toggle(key)}
                      >
                        <span className="font-medium text-sm text-foreground">{q}</span>
                        {isOpen
                          ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                          : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                          {a}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg mt-1">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Still need help?</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Use the AI Tutor for instant answers, or ask in the Community forum where other learners and mentors can help.
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <a href="/ai-tutor">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Ask AI
                </Button>
              </a>
              <a href="/community">
                <Button size="sm" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Community
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
