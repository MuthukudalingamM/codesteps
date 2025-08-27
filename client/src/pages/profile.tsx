import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Award, 
  Calendar, 
  Code, 
  Trophy, 
  Star,
  Edit,
  Save,
  X,
  TrendingUp,
  Book,
  Target
} from "lucide-react";

// Mock user data - in a real app this would come from auth context
const currentUser = {
  id: "current-user",
  username: "Alex",
  email: "alex@example.com",
  skillLevel: "Intermediate",
  currentStreak: 7,
  totalLessons: 30,
  completedLessons: 24,
  challengesSolved: 18,
  joinDate: "2024-01-15",
  bio: "Passionate about learning JavaScript and building amazing web applications.",
  location: "San Francisco, CA",
  githubUrl: "https://github.com/alex",
  linkedinUrl: "https://linkedin.com/in/alex"
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: currentUser.bio,
    location: currentUser.location,
    githubUrl: currentUser.githubUrl,
    linkedinUrl: currentUser.linkedinUrl,
  });
  const { toast } = useToast();

  const { data: userProgress } = useQuery({
    queryKey: ["/api/users", currentUser.id, "progress"],
  });

  const { data: lessons } = useQuery({
    queryKey: ["/api/lessons"],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await apiRequest("PATCH", `/api/users/${currentUser.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", currentUser.id] });
      setIsEditing(false);
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(editForm);
  };

  const handleCancelEdit = () => {
    setEditForm({
      bio: currentUser.bio,
      location: currentUser.location,
      githubUrl: currentUser.githubUrl,
      linkedinUrl: currentUser.linkedinUrl,
    });
    setIsEditing(false);
  };

  const achievements = [
    { id: 1, name: "First Steps", description: "Completed first lesson", icon: "🎯", earned: true },
    { id: 2, name: "Code Warrior", description: "Solved 10 challenges", icon: "⚔️", earned: true },
    { id: 3, name: "Streak Master", description: "7-day learning streak", icon: "🔥", earned: true },
    { id: 4, name: "Helper", description: "Helped 5 community members", icon: "🤝", earned: false },
    { id: 5, name: "Expert", description: "Completed advanced course", icon: "🏆", earned: false },
  ];

  const recentActivity = [
    { type: "lesson", title: "Completed JavaScript Functions", date: "2 hours ago" },
    { type: "challenge", title: "Solved Array Manipulation", date: "1 day ago" },
    { type: "community", title: "Answered question in Community", date: "2 days ago" },
    { type: "streak", title: "Maintained 7-day streak", date: "3 days ago" },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lesson": return <Book className="h-4 w-4 text-primary" />;
      case "challenge": return <Trophy className="h-4 w-4 text-accent" />;
      case "community": return <User className="h-4 w-4 text-secondary" />;
      case "streak": return <TrendingUp className="h-4 w-4 text-orange-500" />;
      default: return <Star className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const skillLevelProgress = {
    "Beginner": 33,
    "Intermediate": 66,
    "Advanced": 100
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <User className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Track your progress and manage your account</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profile</CardTitle>
                {!isEditing ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                    data-testid="edit-profile-button"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCancelEdit}
                      data-testid="cancel-edit-button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSaveProfile}
                      disabled={updateProfileMutation.isPending}
                      data-testid="save-profile-button"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {currentUser.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground">{currentUser.username}</h3>
                  <p className="text-muted-foreground text-sm">{currentUser.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="mt-1"
                      data-testid="bio-input"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{currentUser.bio}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <Input
                      id="location"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="mt-1"
                      data-testid="location-input"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{currentUser.location}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="github">GitHub</Label>
                  {isEditing ? (
                    <Input
                      id="github"
                      value={editForm.githubUrl}
                      onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                      className="mt-1"
                      data-testid="github-input"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{currentUser.githubUrl}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  {isEditing ? (
                    <Input
                      id="linkedin"
                      value={editForm.linkedinUrl}
                      onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                      className="mt-1"
                      data-testid="linkedin-input"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{currentUser.linkedinUrl}</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Skill Level</span>
                  <Badge variant="secondary">{currentUser.skillLevel}</Badge>
                </div>
                <Progress 
                  value={skillLevelProgress[currentUser.skillLevel as keyof typeof skillLevelProgress]} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="progress" data-testid="tab-progress">Progress</TabsTrigger>
              <TabsTrigger value="achievements" data-testid="tab-achievements">Achievements</TabsTrigger>
              <TabsTrigger value="activity" data-testid="tab-activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">{currentUser.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">{currentUser.completedLessons}</div>
                    <div className="text-sm text-muted-foreground">Lessons Done</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">{currentUser.challengesSolved}</div>
                    <div className="text-sm text-muted-foreground">Challenges</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">85%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </CardContent>
                </Card>
              </div>

              {/* Learning Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Learning Path</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">JavaScript Fundamentals</span>
                      <span className="text-sm font-medium">{Math.round((currentUser.completedLessons / currentUser.totalLessons) * 100)}% Complete</span>
                    </div>
                    <Progress value={(currentUser.completedLessons / currentUser.totalLessons) * 100} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {currentUser.completedLessons} of {currentUser.totalLessons} lessons completed
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lessons?.map((lesson: any, index: number) => (
                      <div key={lesson.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index < currentUser.completedLessons 
                            ? "bg-accent text-accent-foreground" 
                            : index === currentUser.completedLessons
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {index < currentUser.completedLessons ? (
                            <Award className="h-4 w-4" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{lesson.title}</h4>
                          <p className="text-sm text-muted-foreground">{lesson.description}</p>
                        </div>
                        <Badge variant={
                          index < currentUser.completedLessons 
                            ? "default" 
                            : index === currentUser.completedLessons
                            ? "secondary"
                            : "outline"
                        }>
                          {index < currentUser.completedLessons 
                            ? "Completed" 
                            : index === currentUser.completedLessons
                            ? "In Progress"
                            : "Locked"
                          }
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <p className="text-muted-foreground text-sm">Unlock achievements as you progress</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div 
                        key={achievement.id}
                        className={`p-4 rounded-lg border ${
                          achievement.earned 
                            ? "bg-accent/5 border-accent/20" 
                            : "bg-muted/30 border-border opacity-60"
                        }`}
                        data-testid={`achievement-${achievement.id}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div>
                            <h4 className="font-medium text-foreground">{achievement.name}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            {achievement.earned && (
                              <Badge variant="default" className="mt-1">Earned</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="mt-0.5">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
