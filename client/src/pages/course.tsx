import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Brain, 
  Trophy, 
  Star,
  Clock,
  CheckCircle,
  Lock,
  PlayCircle,
  Users,
  Code,
  Zap,
  Target
} from "lucide-react";
import { useLocation } from "wouter";

export default function Course() {
  const [, setLocation] = useLocation();
  const [selectedLevel, setSelectedLevel] = useState("beginner");

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["/api/lessons"],
  });

  const allLessons = lessons || [];
  
  const courseStructure = {
    beginner: {
      title: "Beginner Level",
      description: "Start your programming journey from absolute zero",
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      lessons: allLessons.slice(0, 15),
      skills: ["Variables & Data Types", "Functions", "Arrays & Objects", "Control Flow", "Basic Debugging"]
    },
    intermediate: {
      title: "Intermediate Level", 
      description: "Build practical applications and learn modern JavaScript",
      icon: Code,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10", 
      borderColor: "border-blue-500/20",
      lessons: allLessons.slice(15, 30),
      skills: ["DOM Manipulation", "Async Programming", "APIs & HTTP", "ES6+ Features", "Error Handling"]
    },
    advanced: {
      title: "Advanced Level",
      description: "Master complex concepts and design patterns",
      icon: Brain,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20", 
      lessons: allLessons.slice(30, 40),
      skills: ["OOP & Classes", "Design Patterns", "Performance", "Testing", "Build Tools"]
    },
    expert: {
      title: "Expert Level",
      description: "Become a JavaScript expert with advanced techniques",
      icon: Zap,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      lessons: allLessons.slice(40, 50),
      skills: ["Algorithms", "Memory Management", "Security", "Architecture", "Future Tech"]
    }
  };

  const startCourse = () => {
    setLocation('/ai-tutor');
  };

  const continueCourse = () => {
    setLocation('/ai-tutor');
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentLevel = courseStructure[selectedLevel as keyof typeof courseStructure];
  const totalLessons = allLessons.length || 50;
  const completedLessons = 2; // This would come from user progress in real app
  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Target className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Complete Programming Course</h1>
            <p className="text-muted-foreground">Master JavaScript from scratch to expert level - 50 comprehensive lessons</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Overall Progress</p>
          <div className="flex items-center space-x-2">
            <Progress value={progressPercentage} className="w-32" />
            <span className="text-sm font-medium">{completedLessons}/{totalLessons}</span>
          </div>
        </div>
      </div>

      {/* Course Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(courseStructure).map(([key, level]) => {
          const Icon = level.icon;
          const isSelected = selectedLevel === key;
          
          return (
            <Card 
              key={key}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected ? `${level.bgColor} ${level.borderColor} border` : "hover:bg-muted/50"
              }`}
              onClick={() => setSelectedLevel(key)}
              data-testid={`level-${key}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={`h-6 w-6 ${level.color}`} />
                  <Badge variant="secondary">{level.lessons.length} lessons</Badge>
                </div>
                <CardTitle className="text-lg">{level.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{level.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Key Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {level.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Course Actions */}
      <div className="flex items-center justify-center space-x-4 py-6">
        <Button 
          size="lg" 
          onClick={startCourse}
          className="px-8"
          data-testid="start-course"
        >
          <PlayCircle className="h-5 w-5 mr-2" />
          Start Course
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={continueCourse}
          data-testid="continue-course"
        >
          Continue Learning
        </Button>
      </div>

      {/* Detailed Level Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <currentLevel.icon className={`h-6 w-6 ${currentLevel.color}`} />
                <div>
                  <CardTitle>{currentLevel.title} Lessons</CardTitle>
                  <p className="text-sm text-muted-foreground">{currentLevel.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {currentLevel.lessons.map((lesson: any, index: number) => {
                    const isCompleted = index < 2; // Mock completion status
                    const isLocked = index > 2; // Mock lock status
                    
                    return (
                      <div 
                        key={lesson.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                          isCompleted ? "bg-accent/5 border-accent/20" : 
                          isLocked ? "bg-muted/30 border-muted" : "hover:bg-muted/50"
                        }`}
                        data-testid={`lesson-${lesson.id}`}
                      >
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-accent" />
                          ) : isLocked ? (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium truncate ${isLocked ? "text-muted-foreground" : "text-foreground"}`}>
                              {lesson.order}. {lesson.title}
                            </h4>
                            <Badge variant="secondary" className="ml-2">
                              {lesson.difficulty}
                            </Badge>
                          </div>
                          <p className={`text-sm truncate ${isLocked ? "text-muted-foreground" : "text-muted-foreground"}`}>
                            {lesson.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>~15 min</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Course Info Sidebar */}
        <div className="space-y-6">
          {/* Level Details */}
          <Card>
            <CardHeader>
              <CardTitle>What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentLevel.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="text-sm">{skill}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Course Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Course Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Lessons</span>
                  <span className="text-sm font-medium">{totalLessons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estimated Time</span>
                  <span className="text-sm font-medium">~12 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Skill Level</span>
                  <span className="text-sm font-medium">Beginner to Expert</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completion Rate</span>
                  <span className="text-sm font-medium text-accent">89%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Features */}
          <Card>
            <CardHeader>
              <CardTitle>Course Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <span className="text-sm">AI-powered tutoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="h-4 w-4 text-primary" />
                  <span className="text-sm">Interactive code editor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm">Coding challenges</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm">Community support</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}