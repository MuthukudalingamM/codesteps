import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiChat } from "@/components/ui/ai-chat";
import { Brain, BookOpen, Play, ChevronRight } from "lucide-react";

export default function AiTutor() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["/api/lessons"],
  });

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentLesson = selectedLesson 
    ? (lessons as any[])?.find((l: any) => l.id === selectedLesson)
    : (lessons as any[])?.[2]; // Default to Functions lesson

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Brain className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Programming Tutor</h1>
          <p className="text-muted-foreground">Interactive lessons with personalized AI guidance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Lesson Content */}
        <div className="lg:col-span-2">
          {currentLesson && (
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>{currentLesson.title}</span>
                    </CardTitle>
                    <p className="text-muted-foreground text-sm mt-1">
                      {currentLesson.description}
                    </p>
                  </div>
                  <Badge variant={currentLesson.difficulty === "beginner" ? "secondary" : "default"}>
                    {currentLesson.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Lesson Content */}
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground">{currentLesson.content}</p>
                </div>

                {/* Code Example */}
                {currentLesson.codeExample && (
                  <div className="bg-secondary rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">Code Example</h4>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        data-testid="run-example"
                        onClick={() => {
                          console.log("Running code example:", currentLesson.codeExample);
                          // In a real app, this would execute the code in a sandbox
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Run Example
                      </Button>
                    </div>
                    <pre className="font-mono text-sm text-foreground overflow-x-auto">
                      <code>{currentLesson.codeExample}</code>
                    </pre>
                  </div>
                )}

                {/* Interactive AI Chat */}
                <div className="h-96">
                  <AiChat
                    context={`Learning about: ${currentLesson.title}`}
                    title="Ask Your AI Tutor"
                    placeholder={`Ask me anything about ${currentLesson.title.toLowerCase()}...`}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Lesson Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Lessons</CardTitle>
              <p className="text-muted-foreground text-sm">Choose a topic to learn</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(lessons as any[])?.map((lesson: any) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedLesson === lesson.id || (!selectedLesson && lesson.id === "3")
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card hover:bg-muted border-border"
                    }`}
                    data-testid={`lesson-${lesson.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{lesson.title}</h4>
                        <p className="text-xs mt-1 opacity-80">
                          {lesson.description}
                        </p>
                        <Badge 
                          variant="secondary" 
                          className="mt-2"
                        >
                          {lesson.difficulty}
                        </Badge>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Lessons Completed</span>
                  <span className="text-sm font-medium">2/3</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "67%" }}></div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Keep going! You're making great progress.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Tutor Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    Ask specific questions about the code examples
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    Request alternative explanations if something is unclear
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    Ask for practice exercises to reinforce learning
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
