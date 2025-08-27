import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  MessageCircle, 
  ThumbsUp, 
  Reply, 
  Plus,
  TrendingUp,
  Clock,
  Award
} from "lucide-react";

export default function Community() {
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");
  const { toast } = useToast();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["/api/community/posts"],
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const response = await apiRequest("POST", "/api/community/posts", postData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      setNewPostTitle("");
      setNewPostContent("");
      toast({
        title: "Post created!",
        description: "Your post has been shared with the community.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    
    createPostMutation.mutate({
      userId: "current-user", // In a real app, this would come from auth context
      title: newPostTitle,
      content: newPostContent,
      category: selectedCategory,
    });
  };

  const categories = [
    { id: "general", name: "General", icon: MessageCircle },
    { id: "questions", name: "Questions", icon: Users },
    { id: "achievements", name: "Achievements", icon: Award },
    { id: "projects", name: "Projects", icon: TrendingUp },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Users className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Community</h1>
          <p className="text-muted-foreground">Connect with fellow learners and share your journey</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create New Post */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Share with the Community</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="What's your post about?"
                data-testid="post-title-input"
              />
              
              <Textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share your thoughts, questions, or achievements..."
                className="min-h-[100px]"
                data-testid="post-content-input"
              />
              
              <div className="flex items-center justify-between">
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList>
                    {categories.map((category) => (
                      <TabsTrigger 
                        key={category.id} 
                        value={category.id}
                        data-testid={`category-${category.id}`}
                      >
                        <category.icon className="h-4 w-4 mr-1" />
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
                
                <Button 
                  onClick={handleCreatePost}
                  disabled={!newPostTitle.trim() || !newPostContent.trim() || createPostMutation.isPending}
                  data-testid="create-post-button"
                >
                  {createPostMutation.isPending ? "Posting..." : "Post"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Community Posts */}
          <div className="space-y-4">
            {(posts as any[])?.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No posts yet</h3>
                  <p className="text-muted-foreground">Be the first to share something with the community!</p>
                </CardContent>
              </Card>
            ) : (
              (posts as any[])?.map((post: any) => (
                <Card key={post.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {post.userId === "sample-user" ? "J" : "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-foreground">
                              {post.userId === "sample-user" ? "JohnDev" : "SarahCode"}
                            </span>
                            <Badge variant="secondary">{post.category}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {getTimeAgo(post.createdAt)}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">{post.title}</h3>
                          <p className="text-muted-foreground text-sm">{post.content}</p>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <button 
                            className="flex items-center space-x-2 text-muted-foreground hover:text-accent transition-colors"
                            data-testid={`like-post-${post.id}`}
                            onClick={() => {
                              toast({
                                title: "Post liked!",
                                description: "You liked this post.",
                              });
                            }}
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button 
                            className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
                            data-testid={`reply-post-${post.id}`}
                            onClick={() => {
                              toast({
                                title: "Reply feature",
                                description: "Reply functionality coming soon!",
                              });
                            }}
                          >
                            <Reply className="h-4 w-4" />
                            <span className="text-sm">{post.replies}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Community Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Members</span>
                  <span className="text-sm font-medium">2,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Posts Today</span>
                  <span className="text-sm font-medium">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Now</span>
                  <span className="text-sm font-medium text-accent">156</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Trending Topics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">#javascript-functions</span>
                  <Badge variant="secondary">Hot</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">#debugging-tips</span>
                  <Badge variant="secondary">24 posts</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">#project-showcase</span>
                  <Badge variant="secondary">18 posts</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">#beginner-help</span>
                  <Badge variant="secondary">15 posts</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      M
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">Mike</span> replied to "Array Methods"
                    </p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                      L
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">Lisa</span> liked "First Project Complete!"
                    </p>
                    <p className="text-xs text-muted-foreground">12 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                      D
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-foreground">
                      <span className="font-medium">David</span> started a new discussion
                    </p>
                    <p className="text-xs text-muted-foreground">20 minutes ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Be respectful and supportive</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Share knowledge and help others learn</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">Keep discussions programming-related</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">No spam or self-promotion</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
