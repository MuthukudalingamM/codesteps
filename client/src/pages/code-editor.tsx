import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CodeEditor as CodeEditorComponent } from "@/components/ui/code-editor";
import { AiChat } from "@/components/ui/ai-chat";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Code, Play, Lightbulb, CheckCircle, XCircle } from "lucide-react";

const initialCode = `// Write a function to calculate the area of a circle
function calculateArea(radius) {
  // Your code here
  return Math.PI * radius * radius;
}

// Test your function
console.log(calculateArea(5));`;

const testCases = [
  { input: 5, expected: 78.54 },
  { input: 10, expected: 314.16 },
  { input: 1, expected: 3.14 },
];

export default function CodeEditor() {
  const [code, setCode] = useState(initialCode);
  const [results, setResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any>(null);

  const executeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/code/execute", {
        code,
        testCases
      });
      return response.json();
    },
    onSuccess: (data) => {
      setResults(data.results || []);
    }
  });

  const suggestionsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/code-suggestions", {
        code,
        context: "Circle area calculation function"
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSuggestions(data);
    }
  });

  const handleRun = () => {
    executeMutation.mutate();
  };

  const handleGetSuggestions = () => {
    suggestionsMutation.mutate();
  };

  const handleReset = () => {
    setCode(initialCode);
    setResults([]);
    setSuggestions(null);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Code className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Code Editor</h1>
          <p className="text-muted-foreground">Practice coding with AI-powered assistance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Code Editor */}
        <div className="lg:col-span-2 space-y-6">
          <CodeEditorComponent
            value={code}
            onChange={setCode}
            height="400px"
            title="Interactive Code Editor"
            onRun={handleRun}
            onReset={handleReset}
          />

          {/* Test Results */}
          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.map((result, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border ${
                        result.passed 
                          ? "bg-accent/5 border-accent/20" 
                          : "bg-destructive/5 border-destructive/20"
                      }`}
                      data-testid={`test-result-${index}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {result.passed ? (
                            <CheckCircle className="h-4 w-4 text-accent" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive" />
                          )}
                          <span className="text-sm font-medium">
                            Test {index + 1}
                          </span>
                        </div>
                        <Badge variant={result.passed ? "default" : "destructive"}>
                          {result.passed ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Input: {result.input} | Expected: {result.expected} | 
                        Actual: {result.actual?.toFixed(2) || "N/A"}
                        {result.error && <div className="text-destructive mt-1">Error: {result.error}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Suggestions */}
          {suggestions && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  <span>AI Code Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Feedback</h4>
                  <p className="text-sm text-muted-foreground">{suggestions.feedback}</p>
                </div>
                
                {suggestions.suggestions && suggestions.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Suggestions</h4>
                    <ul className="space-y-1">
                      {suggestions.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {suggestions.encouragement && (
                  <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
                    <p className="text-sm text-accent font-medium">{suggestions.encouragement}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleRun} 
                className="w-full" 
                disabled={executeMutation.isPending}
                data-testid="run-code-main"
              >
                <Play className="h-4 w-4 mr-2" />
                {executeMutation.isPending ? "Running..." : "Run Code"}
              </Button>
              <Button 
                onClick={handleGetSuggestions} 
                variant="outline" 
                className="w-full"
                disabled={suggestionsMutation.isPending}
                data-testid="get-suggestions"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                {suggestionsMutation.isPending ? "Analyzing..." : "Get AI Suggestions"}
              </Button>
            </CardContent>
          </Card>

          {/* Exercise Description */}
          <Card>
            <CardHeader>
              <CardTitle>Current Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-foreground">Circle Area Calculator</h4>
                  <Badge variant="secondary">Beginner</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Write a function that calculates the area of a circle given its radius. 
                  The formula is: Area = π × radius²
                </p>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-foreground">Requirements:</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Function should be named "calculateArea"</li>
                    <li>• Accept radius as a parameter</li>
                    <li>• Return the calculated area</li>
                    <li>• Use Math.PI for the π value</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <div className="h-96">
            <AiChat
              context="Code editing and programming help"
              title="Code Assistant"
              placeholder="Ask me about your code..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
