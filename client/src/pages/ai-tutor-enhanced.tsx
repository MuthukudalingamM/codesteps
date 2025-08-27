import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Brain, 
  Send, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Clock,
  BookOpen,
  Code,
  Lightbulb,
  User,
  Bot,
  Loader,
  AlertCircle,
  Terminal,
  Copy,
  Check
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface CodeExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
}

export default function AiTutorEnhanced() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [codeToRun, setCodeToRun] = useState("");
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["/api/lessons"],
  });

  const { data: userProgress } = useQuery({
    queryKey: ["/api/users/current-user/progress"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          message: content,
          context: selectedLesson ? {
            lessonId: selectedLesson,
            lessonTitle: currentLesson?.title
          } : undefined
        }),
      });
    },
    onSuccess: (response) => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: response.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    },
    onError: (error) => {
      setIsTyping(false);
      toast({
        title: "AI Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    }
  });

  const executeCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      return await apiRequest("/api/code/execute", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
    },
    onSuccess: (response) => {
      setExecutionResult({
        output: response.output || "Code executed successfully",
        error: response.error,
        executionTime: response.executionTime || 0
      });
      setIsExecuting(false);
    },
    onError: (error) => {
      setExecutionResult({
        output: "",
        error: "Failed to execute code. Please check your syntax.",
        executionTime: 0
      });
      setIsExecuting(false);
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    sendMessageMutation.mutate(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const executeCode = () => {
    if (!codeToRun.trim()) {
      toast({
        title: "No Code",
        description: "Please enter some code to execute.",
        variant: "destructive"
      });
      return;
    }

    setIsExecuting(true);
    setExecutionResult(null);
    executeCodeMutation.mutate(codeToRun);
  };

  const copyToCodeEditor = (code: string) => {
    setCodeToRun(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    toast({
      title: "Code Copied",
      description: "Code has been copied to the code editor."
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Content copied to clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

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

  const allLessons = lessons || [];
  const currentLesson = selectedLesson 
    ? allLessons.find((l: any) => l.id === selectedLesson)
    : allLessons[2]; // Default to Functions lesson

  const completedLessons = userProgress?.filter((p: any) => p.status === 'completed').length || 0;
  const progressPercentage = allLessons.length > 0 ? (completedLessons / allLessons.length) * 100 : 0;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Programming Tutor</h1>
            <p className="text-muted-foreground">Interactive lessons with intelligent AI guidance</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Progress</p>
          <div className="flex items-center space-x-2">
            <Progress value={progressPercentage} className="w-32" />
            <span className="text-sm font-medium">{completedLessons}/{allLessons.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Lesson List */}
        <div className="xl:col-span-1">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Lessons</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {allLessons.map((lesson: any) => (
                    <div
                      key={lesson.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedLesson === lesson.id 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedLesson(lesson.id)}
                      data-testid={`lesson-${lesson.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{lesson.order}. {lesson.title}</h4>
                          <Badge variant="secondary" className="mt-1">
                            {lesson.difficulty}
                          </Badge>
                        </div>
                        {userProgress?.find((p: any) => p.lessonId === lesson.id && p.status === 'completed') && (
                          <CheckCircle className="h-4 w-4 text-accent ml-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="xl:col-span-2 space-y-6">
          {/* Current Lesson */}
          {currentLesson && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>{currentLesson.title}</span>
                    </CardTitle>
                    <Badge variant="outline" className="mt-2">{currentLesson.difficulty}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">~15 min</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="text-muted-foreground mb-4">{currentLesson.description}</p>
                    <div className="whitespace-pre-line">{currentLesson.content}</div>
                  </div>
                </ScrollArea>

                {currentLesson.codeExample && (
                  <div className="mt-4 bg-secondary rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">Code Example</h4>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToCodeEditor(currentLesson.codeExample)}
                          data-testid="copy-to-editor"
                        >
                          {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => copyToClipboard(currentLesson.codeExample)}
                          data-testid="copy-code"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    <pre className="font-mono text-sm text-foreground overflow-x-auto bg-background p-3 rounded border">
                      <code>{currentLesson.codeExample}</code>
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Code Editor & Execution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Terminal className="h-5 w-5" />
                <span>Code Editor</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Write your JavaScript code here..."
                  value={codeToRun}
                  onChange={(e) => setCodeToRun(e.target.value)}
                  className="font-mono min-h-32"
                  data-testid="code-editor"
                />
                
                <div className="flex justify-between items-center">
                  <Button 
                    onClick={executeCode}
                    disabled={isExecuting || !codeToRun.trim()}
                    data-testid="run-code"
                  >
                    {isExecuting ? (
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    {isExecuting ? "Running..." : "Run Code"}
                  </Button>
                  
                  {executionResult && (
                    <span className="text-sm text-muted-foreground">
                      Executed in {executionResult.executionTime}ms
                    </span>
                  )}
                </div>

                {/* Execution Result */}
                {executionResult && (
                  <div className="mt-4">
                    {executionResult.error ? (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <span className="font-medium text-destructive">Error</span>
                        </div>
                        <pre className="text-sm text-destructive">{executionResult.error}</pre>
                      </div>
                    ) : (
                      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span className="font-medium text-accent">Output</span>
                        </div>
                        <pre className="text-sm text-foreground">{executionResult.output}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Chat */}
        <div className="xl:col-span-1">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>AI Assistant</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Ask questions about {currentLesson?.title || "programming"}
              </p>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <Lightbulb className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Ask me anything about programming!</p>
                      <p className="text-xs mt-1">I can help explain concepts, debug code, or provide examples.</p>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.type === 'ai' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                          {message.type === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-foreground rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Ask me anything..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                  data-testid="ai-chat-input"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isTyping || !inputMessage.trim()}
                  data-testid="send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}