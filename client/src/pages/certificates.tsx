import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Award, BookOpen, Code, Brain, Zap, CheckCircle,
  Lock, ChevronRight, Trophy, Star
} from "lucide-react";

const LEVELS = [
  {
    key: "beginner",
    label: "Beginner",
    icon: BookOpen,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    gradFrom: "#22c55e",
    gradTo: "#16a34a",
    accent: "#15803d",
    badge: "#dcfce7",
    skills: ["Variables & Data Types", "Functions", "Arrays & Objects", "Control Flow"],
  },
  {
    key: "intermediate",
    label: "Intermediate",
    icon: Code,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    gradFrom: "#3b82f6",
    gradTo: "#1d4ed8",
    accent: "#1e40af",
    badge: "#dbeafe",
    skills: ["DOM Manipulation", "Async Programming", "APIs & HTTP", "ES6+ Features"],
  },
  {
    key: "advanced",
    label: "Advanced",
    icon: Brain,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    gradFrom: "#8b5cf6",
    gradTo: "#6d28d9",
    accent: "#5b21b6",
    badge: "#ede9fe",
    skills: ["OOP & Classes", "Design Patterns", "Performance", "Testing"],
  },
  {
    key: "expert",
    label: "Expert",
    icon: Zap,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    gradFrom: "#f59e0b",
    gradTo: "#b45309",
    accent: "#92400e",
    badge: "#fef3c7",
    skills: ["Algorithms", "Memory Management", "Security", "Architecture"],
  },
];

function completionKey(userId: string) {
  return `codesteps_completed_${userId}`;
}

function loadCompleted(userId: string): Set<string> {
  try {
    const raw = localStorage.getItem(completionKey(userId));
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

export default function Certificates() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const userId = user?.id ?? "guest";

  useEffect(() => {
    setCompleted(loadCompleted(userId));
  }, [userId]);

  const { data: lessons = [] } = useQuery<any[]>({ queryKey: ["/api/lessons"] });

  const getProgress = (levelKey: string) => {
    const lvlLessons = lessons.filter((l: any) => l.difficulty === levelKey);
    const done = lvlLessons.filter((l: any) => completed.has(l.id)).length;
    const total = lvlLessons.length || 20;
    return { done, total, pct: Math.round((done / total) * 100) };
  };

  const earnedCount = LEVELS.filter(l => {
    const { done, total } = getProgress(l.key);
    return total > 0 && done === total;
  }).length;

  return (
    <div className="p-4 lg:p-6 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-500/10 rounded-xl">
            <Award className="h-8 w-8 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Certificates</h1>
            <p className="text-muted-foreground">Complete all lessons in a level to earn your certificate</p>
          </div>
        </div>
        {earnedCount > 0 && (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30 px-4 py-1.5 text-sm flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            {earnedCount} / {LEVELS.length} Earned
          </Badge>
        )}
      </div>

      {/* Overall progress bar */}
      <Card>
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-foreground">Overall Course Progress</span>
            <span className="text-muted-foreground">
              {LEVELS.reduce((s, l) => s + getProgress(l.key).done, 0)} /
              {LEVELS.reduce((s, l) => s + getProgress(l.key).total, 0)} lessons
            </span>
          </div>
          <Progress
            value={Math.round(
              (LEVELS.reduce((s, l) => s + getProgress(l.key).done, 0) /
                Math.max(1, LEVELS.reduce((s, l) => s + getProgress(l.key).total, 0))) * 100
            )}
            className="h-3"
          />
          <div className="flex justify-between mt-2">
            {LEVELS.map(l => {
              const { pct } = getProgress(l.key);
              return (
                <div key={l.key} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <l.icon className={`h-3 w-3 ${l.color}`} />
                  {pct}%
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Certificate cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LEVELS.map(level => {
          const { done, total, pct } = getProgress(level.key);
          const isComplete = total > 0 && done === total;
          const Icon = level.icon;

          return (
            <Card
              key={level.key}
              className={`overflow-hidden transition-all duration-200 ${
                isComplete
                  ? `${level.border} border-2 shadow-lg`
                  : "hover:shadow-md"
              }`}
            >
              {/* Gradient top stripe */}
              <div
                className="h-2"
                style={{ background: `linear-gradient(90deg, ${level.gradFrom}, ${level.gradTo})` }}
              />

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${level.bg}`}>
                      <Icon className={`h-6 w-6 ${level.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{level.label} Level</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">JavaScript Course</p>
                    </div>
                  </div>
                  {isComplete ? (
                    <Badge className="bg-green-500/10 text-green-600 border-green-500/30 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Earned
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground">
                      <Lock className="h-3 w-3" /> Locked
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {level.skills.map((skill, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        isComplete
                          ? `${level.bg} ${level.color} ${level.border}`
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>{done} / {total} lessons completed</span>
                    <span>{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>

                {/* Certificate preview (earned) */}
                {isComplete && (
                  <div
                    className="rounded-lg p-4 border text-center relative overflow-hidden"
                    style={{ background: level.badge, borderColor: level.gradFrom + "40" }}
                  >
                    <div className="absolute inset-0 opacity-5" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, ${level.gradFrom} 0, ${level.gradFrom} 1px, transparent 0, transparent 50%)`,
                      backgroundSize: "16px 16px",
                    }} />
                    <Award className="h-8 w-8 mx-auto mb-2" style={{ color: level.accent }} />
                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: level.accent }}>
                      Certificate of Completion
                    </p>
                    <p className="text-sm font-bold mt-1" style={{ color: level.accent }}>
                      {user?.username || "Student"}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: level.accent + "99" }}>
                      {level.label} JavaScript Course · 20 Lessons
                    </p>
                  </div>
                )}

                {/* Action button */}
                <Button
                  className={`w-full flex items-center justify-center gap-2 ${
                    isComplete
                      ? "text-white"
                      : ""
                  }`}
                  style={isComplete ? { background: `linear-gradient(135deg, ${level.gradFrom}, ${level.gradTo})` } : {}}
                  variant={isComplete ? "default" : "outline"}
                  onClick={() =>
                    isComplete
                      ? setLocation(`/certificate/${level.key}`)
                      : setLocation("/course")
                  }
                >
                  {isComplete ? (
                    <>
                      <Award className="h-4 w-4" />
                      View & Download Certificate
                      <ChevronRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Icon className={`h-4 w-4 ${level.color}`} />
                      {pct > 0 ? `Continue (${pct}% done)` : "Start Course"}
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {earnedCount === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center text-center py-12">
            <div className="p-4 bg-yellow-500/10 rounded-full mb-4">
              <Star className="h-10 w-10 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No certificates yet</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
              Complete all 20 lessons in any level to earn your first certificate. Start with the Beginner course!
            </p>
            <Button onClick={() => setLocation("/course")} className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Start Beginner Course
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
