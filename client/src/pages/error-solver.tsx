import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Bug, AlertTriangle, CheckCircle, Lightbulb, Copy } from "lucide-react";

const sampleErrors = [
  {
    id: 1,
    error: "TypeError: Cannot read property 'length' of undefined",
    code: `function getLength(arr) {
  return arr.length; // Error here
}`,
    line: 3,
    column: 15,
    severity: "error"
  },
  {
    id: 2,
    error: "ReferenceError: myVariable is not defined",
    code: `function example() {
  console.log(myVariable); // Error here
}`,
    line: 2,
    column: 15,
    severity: "error"
  },
  {
    id: 3,
    error: "SyntaxError: Unexpected token '}'",
    code: `function broken() {
  if (true) {
    console.log("test");
  } // Missing closing brace
}`,
    line: 4,
    column: 1,
    severity: "error"
  }
];

export default function ErrorSolver() {
  const [selectedError, setSelectedError] = useState(sampleErrors[0]);
  const [customError, setCustomError] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [explanation, setExplanation] = useState<any>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: string = "content") => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} copied to clipboard.`
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const explainMutation = useMutation({
    mutationFn: async (error: any) => {
      const response = await apiRequest("/api/ai/explain-error", {
        method: "POST",
        body: JSON.stringify({
          error: error.error,
          code: error.code,
          context: error.context || "General debugging",
          userLevel: 'beginner', // Could be dynamic based on user data
          userId: 'current-user'
        }),
      });
      return response;
    },
    onSuccess: (data) => {
      setExplanation(data);
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "I'm having trouble analyzing this error. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleExplainError = (error: any) => {
    setSelectedError(error);
    explainMutation.mutate(error);
  };

  const handleExplainCustom = () => {
    if (!customError.trim() || !customCode.trim()) return;
    
    const error = {
      id: Date.now(),
      error: customError,
      code: customCode,
      line: 0,
      column: 0,
      severity: "error" as const
    };
    
    setSelectedError(error);
    explainMutation.mutate(error);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Bug className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Error Solver</h1>
          <p className="text-muted-foreground">Get instant help with debugging and error resolution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Error Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Error */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span>Current Error</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">{selectedError.error}</p>
                    {selectedError.line && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Line {selectedError.line}, Column {selectedError.column}
                      </p>
                    )}
                    
                    <div className="mt-3 p-3 bg-secondary rounded text-xs font-mono">
                      <pre className="whitespace-pre-wrap">{selectedError.code}</pre>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <Button 
                  onClick={() => handleExplainError(selectedError)}
                  disabled={explainMutation.isPending}
                  data-testid="explain-error"
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {explainMutation.isPending ? "Analyzing..." : "Get AI Explanation"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Explanation */}
          {explanation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span>AI Error Analysis</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(explanation, null, 2), "analysis")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Analysis
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span>What this error means:</span>
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{explanation.explanation}</p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                    <Bug className="h-4 w-4 text-orange-500" />
                    <span>Root cause:</span>
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{explanation.cause}</p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>How to fix it:</span>
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{explanation.solution}</p>

                  {explanation.correctedCode && (
                    <div className="bg-secondary rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-foreground text-sm">Corrected Code:</h5>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(explanation.correctedCode, "corrected code")}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="text-xs font-mono text-foreground overflow-x-auto bg-background p-3 rounded border">
                        <code>{explanation.correctedCode}</code>
                      </pre>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                  <h4 className="font-medium text-accent mb-2 flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4" />
                    <span>Prevention Tips:</span>
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{explanation.tips}</p>
                </div>

                {explanation.relatedConcepts && explanation.relatedConcepts.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Related Concepts to Learn:</h4>
                    <div className="flex flex-wrap gap-2">
                      {explanation.relatedConcepts.map((concept: string, index: number) => (
                        <Badge key={index} variant="secondary">{concept}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {explanation.encouragement && (
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm text-primary font-medium text-center">{explanation.encouragement}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Custom Error Input */}
          <Card>
            <CardHeader>
              <CardTitle>Analyze Your Own Error</CardTitle>
              <p className="text-muted-foreground text-sm">Paste your error message and code for analysis</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Error Message
                </label>
                <Textarea
                  value={customError}
                  onChange={(e) => setCustomError(e.target.value)}
                  placeholder="Paste your error message here..."
                  className="min-h-[60px]"
                  data-testid="custom-error-input"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Your Code
                </label>
                <Textarea
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="Paste the problematic code here..."
                  className="min-h-[120px] font-mono text-sm"
                  data-testid="custom-code-input"
                />
              </div>
              
              <Button 
                onClick={handleExplainCustom}
                disabled={!customError.trim() || !customCode.trim() || explainMutation.isPending}
                data-testid="analyze-custom-error"
              >
                <Bug className="h-4 w-4 mr-2" />
                Analyze Error
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Common Errors */}
          <Card>
            <CardHeader>
              <CardTitle>Common JavaScript Errors</CardTitle>
              <p className="text-muted-foreground text-sm">Click to analyze</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sampleErrors.map((error) => (
                  <button
                    key={error.id}
                    onClick={() => handleExplainError(error)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedError.id === error.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card hover:bg-muted border-border"
                    }`}
                    data-testid={`sample-error-${error.id}`}
                  >
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium line-clamp-2">
                          {error.error}
                        </p>
                        <Badge variant="destructive" className="mt-1">
                          {error.severity}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Debug Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Debugging Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    Read error messages carefully - they often contain the exact line number
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    Use console.log() to check variable values at different points
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    Check for typos in variable and function names
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-muted-foreground">
                    Make sure all brackets and parentheses are properly closed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Your Debug Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Errors Solved</span>
                  <span className="text-sm font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Most Common</span>
                  <Badge variant="secondary">TypeError</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="text-sm font-medium text-accent">85%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
