import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen, Brain, Trophy, Star, Clock, CheckCircle,
  PlayCircle, Code, Zap, Target, ChevronLeft, ChevronRight,
  Copy, Check, ArrowLeft, Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LEVELS = {
  beginner: {
    label: "Beginner",
    icon: BookOpen,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    skills: ["Variables & Data Types", "Functions", "Arrays & Objects", "Control Flow", "Basic Debugging"],
  },
  intermediate: {
    label: "Intermediate",
    icon: Code,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    skills: ["DOM Manipulation", "Async Programming", "APIs & HTTP", "ES6+ Features", "Error Handling"],
  },
  advanced: {
    label: "Advanced",
    icon: Brain,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    skills: ["OOP & Classes", "Design Patterns", "Performance", "Testing", "Build Tools"],
  },
  expert: {
    label: "Expert",
    icon: Zap,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    skills: ["Algorithms", "Memory Management", "Security", "Architecture", "Future Tech"],
  },
};

export default function Course() {
  const [selectedLevel, setSelectedLevel] = useState<keyof typeof LEVELS>("beginner");
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lessons = [], isLoading } = useQuery<any[]>({ queryKey: ["/api/lessons"] });

  const lessonsByLevel = (level: string) =>
    lessons
      .filter((l: any) => l.difficulty === level)
      .sort((a: any, b: any) => a.order - b.order);

  const levelLessons = lessonsByLevel(selectedLevel);
  const totalLessons = lessons.length;

  const openLesson = (lesson: any) => setSelectedLesson(lesson);

  const closeLessonView = () => setSelectedLesson(null);

  const goNext = () => {
    const idx = levelLessons.findIndex((l: any) => l.id === selectedLesson?.id);
    if (idx < levelLessons.length - 1) setSelectedLesson(levelLessons[idx + 1]);
  };

  const goPrev = () => {
    const idx = levelLessons.findIndex((l: any) => l.id === selectedLesson?.id);
    if (idx > 0) setSelectedLesson(levelLessons[idx - 1]);
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-10 bg-muted rounded w-1/3" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-muted rounded" />)}
        </div>
        <div className="h-64 bg-muted rounded" />
      </div>
    );
  }

  // ── Lesson Detail View ─────────────────────────────────────────────────
  if (selectedLesson) {
    const idx = levelLessons.findIndex((l: any) => l.id === selectedLesson.id);
    const lvl = LEVELS[selectedLesson.difficulty as keyof typeof LEVELS] || LEVELS.beginner;
    const LvlIcon = lvl.icon;

    return (
      <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
        {/* Back + navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={closeLessonView} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Lessons
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goPrev} disabled={idx === 0}>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {idx + 1} / {levelLessons.length}
            </span>
            <Button variant="outline" size="sm" onClick={goNext} disabled={idx === levelLessons.length - 1}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Lesson header */}
        <Card className={`${lvl.bg} ${lvl.border} border-2`}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${lvl.bg}`}>
                  <LvlIcon className={`h-6 w-6 ${lvl.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Lesson {selectedLesson.order} · {lvl.label}
                  </p>
                  <h1 className="text-2xl font-bold text-foreground">{selectedLesson.title}</h1>
                  <p className="text-muted-foreground mt-1">{selectedLesson.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                <Clock className="h-4 w-4" />
                ~15 min
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Lesson content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Lesson Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {selectedLesson.content.split("\n").map((line: string, i: number) => {
                if (line.trim() === "") return <div key={i} className="h-2" />;
                if (line.startsWith("•")) {
                  return (
                    <div key={i} className="flex items-start gap-2 ml-4 my-1">
                      <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${lvl.color.replace("text-", "bg-")}`} />
                      <span className="text-sm text-foreground">{line.slice(1).trim()}</span>
                    </div>
                  );
                }
                return (
                  <p key={i} className={`text-sm leading-relaxed ${line.includes(":") && !line.includes(" ") ? "font-semibold text-foreground mt-3" : "text-muted-foreground"}`}>
                    {line}
                  </p>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Code Example */}
        {selectedLesson.codeExample && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Code Example
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyCode(selectedLesson.codeExample)}
                  className="flex items-center gap-1"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800">
                <div className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                  <span className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs text-zinc-400">JavaScript</span>
                </div>
                <pre className="p-4 overflow-x-auto text-sm">
                  <code className="text-zinc-100 font-mono leading-relaxed">
                    {selectedLesson.codeExample}
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bottom navigation */}
        <div className="flex items-center justify-between pt-2 pb-6">
          <Button variant="outline" onClick={goPrev} disabled={idx === 0} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Previous Lesson
          </Button>
          <Button onClick={idx < levelLessons.length - 1 ? goNext : closeLessonView} className="flex items-center gap-2">
            {idx < levelLessons.length - 1 ? (
              <>Next Lesson <ChevronRight className="h-4 w-4" /></>
            ) : (
              <>Finish Level <CheckCircle className="h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>
    );
  }

  // ── Course List View ───────────────────────────────────────────────────
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Target className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Complete Programming Course</h1>
            <p className="text-muted-foreground">Master JavaScript from scratch to expert level · {totalLessons} lessons</p>
          </div>
        </div>
      </div>

      {/* Level selector cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(Object.entries(LEVELS) as [keyof typeof LEVELS, typeof LEVELS[keyof typeof LEVELS]][]).map(([key, lvl]) => {
          const Icon = lvl.icon;
          const count = lessonsByLevel(key).length;
          const isActive = selectedLevel === key;
          return (
            <Card
              key={key}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isActive ? `${lvl.bg} ${lvl.border} border-2` : "hover:bg-muted/40"}`}
              onClick={() => setSelectedLevel(key)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Icon className={`h-6 w-6 ${lvl.color}`} />
                  <Badge variant="secondary">{count} lessons</Badge>
                </div>
                <CardTitle className="text-base">{lvl.label} Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {lvl.skills.slice(0, 3).map((s, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lessons + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson list */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                {(() => { const Icon = LEVELS[selectedLevel].icon; return <Icon className={`h-6 w-6 ${LEVELS[selectedLevel].color}`} />; })()}
                <div>
                  <CardTitle>{LEVELS[selectedLevel].label} Level Lessons</CardTitle>
                  <p className="text-sm text-muted-foreground">Click any lesson to start learning</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-2">
                <div className="space-y-2">
                  {levelLessons.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No lessons found for this level.</p>
                  ) : (
                    levelLessons.map((lesson: any, index: number) => (
                      <button
                        key={lesson.id}
                        onClick={() => openLesson(lesson)}
                        className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-primary/30 hover:bg-muted/50 transition-all duration-150 group"
                      >
                        {/* Number circle */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${LEVELS[selectedLevel].bg} ${LEVELS[selectedLevel].color} border ${LEVELS[selectedLevel].border}`}>
                          {lesson.order}
                        </div>

                        {/* Title + description */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{lesson.description}</p>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
                            <Clock className="h-3 w-3" /> 15 min
                          </span>
                          <PlayCircle className={`h-5 w-5 ${LEVELS[selectedLevel].color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>What You'll Learn</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {LEVELS[selectedLevel].skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Star className={`h-4 w-4 ${LEVELS[selectedLevel].color}`} />
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Course Statistics</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Lessons</span>
                  <span className="font-medium">{totalLessons}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">This Level</span>
                  <span className="font-medium">{levelLessons.length} lessons</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Est. Time</span>
                  <span className="font-medium">~{levelLessons.length * 15} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Level</span>
                  <Badge variant="secondary" className="capitalize">{selectedLevel}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Course Features</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  [Brain, "AI-powered tutoring"],
                  [Code, "Interactive code examples"],
                  [Trophy, "Coding challenges"],
                  [Users, "Community support"],
                ].map(([Icon, label]: any, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
