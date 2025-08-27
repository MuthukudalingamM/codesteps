import { useQuery } from "@tanstack/react-query";
import { ProgressCard } from "@/components/ui/progress-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AiChat } from "@/components/ui/ai-chat";
import { CodeEditor } from "@/components/ui/code-editor";
import { LessonReminder, useLessonReminders } from "@/components/ui/lesson-reminder";
import {
  Flame,
  Book,
  Trophy,
  Star,
  Brain,
  Play,
  Lightbulb,
  CheckCircle,
  Circle,
  Lock,
  Bell,
  Settings
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

const sampleCode = `// TODO: Implement your function here
function calculateArea(radius) {
  // Your code here
  return Math.PI * radius * radius;
}`;

export default function Dashboard() {
  const [code, setCode] = useState(sampleCode);
  const [, setLocation] = useLocation();
  const [showReminders, setShowReminders] = useState(true);
  const { toast } = useToast();
  const {
    reminderSettings,
    updateReminderSettings,
    requestNotificationPermission
  } = useLessonReminders();

  useEffect(() => {
    // Check if user wants browser notifications
    const checkNotifications = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        const granted = await requestNotificationPermission();
        if (granted) {
          toast({
            title: "Notifications Enabled! 🔔",
            description: "You'll receive helpful learning reminders."
          });
        }
      }
    };

    checkNotifications();
  }, []);

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["/api/lessons"],
  });

  const { data: challenges, isLoading: challengesLoading } = useQuery({
    queryKey: ["/api/challenges"],
  });

  const { data: communityPosts, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/community/posts"],
  });

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProgressCard
          title="Current Streak"
          value="7 days"
          icon={Flame}
          variant="accent"
        />
        <ProgressCard
          title="Lessons Completed"
          value="24/30"
          progress={80}
          icon={Book}
          variant="primary"
        />
        <ProgressCard
          title="Challenges Solved"
          value="18"
          icon={Trophy}
          variant="accent"
        />
        <ProgressCard
          title="Skill Level"
          value="Intermediate"
          icon={Star}
          variant="primary"
        />
      </div>

      {/* Lesson Reminders */}
      {showReminders && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Learning Reminders</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReminders(false)}
                className="text-muted-foreground"
              >
                Hide
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation('/settings')}
              >
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
            </div>
          </div>

          <LessonReminder
            userId="current-user"
            currentProgress={lessons}
            lastActive={new Date(Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000))} // Random last active for demo
          />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Learning Path */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <p className="text-muted-foreground text-sm">Pick up where you left off</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="text-primary h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-foreground">JavaScript Functions</h4>
                  <p className="text-muted-foreground text-sm mt-1">
                    Learn about function declarations, expressions, and arrow functions
                  </p>
                  
                  {/* AI Tutor Preview */}
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Brain className="text-primary-foreground h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground font-medium">AI Tutor</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Functions are reusable blocks of code. Let's start with a simple function declaration...
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Code Example */}
                  <div className="mt-4 bg-secondary rounded-lg p-4 font-mono text-sm">
                    <div className="text-muted-foreground mb-2">// Example: Function Declaration</div>
                    <div className="space-y-1">
                      <div>
                        <span className="text-purple-500">function</span>{" "}
                        <span className="text-blue-500">greetUser</span>
                        <span className="text-foreground">(name) {"{"}</span>
                      </div>
                      <div className="pl-4">
                        <span className="text-purple-500">return</span>{" "}
                        <span className="text-green-500">{"`Hello, ${name}!`"}</span>;
                      </div>
                      <div>{"}"}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">60% complete</span>
                    </div>
                    <Button 
                      data-testid="continue-lesson"
                      onClick={() => setLocation('/ai-tutor')}
                    >
                      Continue Lesson
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Practice Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Interactive Code Editor</CardTitle>
                  <p className="text-muted-foreground text-sm">Practice with AI-powered assistance</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CodeEditor
                value={code}
                onChange={setCode}
                height="200px"
                onRun={() => console.log("Running code:", code)}
              />
              
              {/* AI Assistant Panel */}
              <div className="mt-4 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="text-accent-foreground h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-accent">AI Suggestion</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Great job! Your function correctly calculates the area of a circle. 
                      Try adding input validation to handle negative values.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-6">
          {/* Daily Challenge */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Challenge</CardTitle>
              <p className="text-muted-foreground text-sm">Test your skills</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <Flame className="text-destructive h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Array Manipulation</h4>
                  <Badge variant="secondary">Medium difficulty</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Find the second largest number in an array without sorting.
              </p>
              <Button 
                className="w-full" 
                data-testid="start-challenge"
                onClick={() => setLocation('/challenges')}
              >
                Start Challenge
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Completed "Variables & Data Types"
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Solved "FizzBuzz Challenge"
                    </p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Asked question in Community
                    </p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Path Progress */}
          <Card>
            <CardHeader>
              <CardTitle>JavaScript Fundamentals</CardTitle>
              <p className="text-muted-foreground text-sm">Your current path</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-accent" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Introduction</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-accent" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Variables & Types</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Functions</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Circle className="w-6 h-6 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Objects & Arrays</p>
                    <p className="text-xs text-muted-foreground">Locked</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Lock className="w-6 h-6 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">DOM Manipulation</p>
                    <p className="text-xs text-muted-foreground">Locked</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
