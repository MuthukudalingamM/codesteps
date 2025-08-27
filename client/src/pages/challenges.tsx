import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CodeEditor } from "@/components/ui/code-editor";
import { Trophy, Timer, Star, Play, CheckCircle, XCircle } from "lucide-react";

export default function Challenges() {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const { data: challenges, isLoading } = useQuery({
    queryKey: ["/api/challenges"],
  });

  const selectedChallengeData = selectedChallenge 
    ? challenges?.find((c: any) => c.id === selectedChallenge)
    : challenges?.[0];

  const handleSelectChallenge = (challengeId: string) => {
    setSelectedChallenge(challengeId);
    setCode("");
    setResults([]);
  };

  const handleRunCode = () => {
    if (!selectedChallengeData?.testCases) return;
    
    // Simple code execution simulation
    const testResults = selectedChallengeData.testCases.map((testCase: any, index: number) => {
      try {
        // This is a simplified example - in production, use a proper sandbox
        const func = new Function('arr', `${code}\nreturn findSecondLargest ? findSecondLargest(arr) : null;`);
        const result = func(testCase.input);
        return {
          id: index,
          input: testCase.input,
          expected: testCase.expected,
          actual: result,
          passed: result === testCase.expected
        };
      } catch (error) {
        return {
          id: index,
          input: testCase.input,
          expected: testCase.expected,
          actual: null,
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });
    
    setResults(testResults);
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "hard": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Trophy className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Coding Challenges</h1>
          <p className="text-muted-foreground">Test and improve your programming skills</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Challenge Area */}
        <div className="lg:col-span-2 space-y-6">
          {selectedChallengeData && (
            <>
              {/* Challenge Description */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5" />
                      <span>{selectedChallengeData.title}</span>
                    </CardTitle>
                    <Badge className={getDifficultyColor(selectedChallengeData.difficulty)}>
                      {selectedChallengeData.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{selectedChallengeData.description}</p>
                    
                    {/* Test Cases Preview */}
                    {selectedChallengeData.testCases && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2">Test Cases:</h4>
                        <div className="bg-secondary rounded-lg p-3 font-mono text-sm space-y-1">
                          {selectedChallengeData.testCases.slice(0, 2).map((testCase: any, index: number) => (
                            <div key={index} className="text-muted-foreground">
                              Input: {JSON.stringify(testCase.input)} → Expected: {testCase.expected}
                            </div>
                          ))}
                          {selectedChallengeData.testCases.length > 2 && (
                            <div className="text-muted-foreground">
                              ...and {selectedChallengeData.testCases.length - 2} more test cases
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Code Editor */}
              <CodeEditor
                value={code}
                onChange={setCode}
                height="400px"
                title="Solution"
                onRun={handleRunCode}
                onReset={() => setCode("")}
              />

              {/* Test Results */}
              {results.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Test Results</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.map((result) => (
                        <div 
                          key={result.id}
                          className={`p-3 rounded-lg border ${
                            result.passed 
                              ? "bg-accent/5 border-accent/20" 
                              : "bg-destructive/5 border-destructive/20"
                          }`}
                          data-testid={`test-result-${result.id}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {result.passed ? (
                                <CheckCircle className="h-4 w-4 text-accent" />
                              ) : (
                                <XCircle className="h-4 w-4 text-destructive" />
                              )}
                              <span className="text-sm font-medium">
                                Test Case {result.id + 1}
                              </span>
                            </div>
                            <Badge variant={result.passed ? "default" : "destructive"}>
                              {result.passed ? "Passed" : "Failed"}
                            </Badge>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground font-mono">
                            Input: {JSON.stringify(result.input)} | Expected: {result.expected} | 
                            Actual: {result.actual !== null ? result.actual : "N/A"}
                            {result.error && <div className="text-destructive mt-1">Error: {result.error}</div>}
                          </div>
                        </div>
                      ))}
                      
                      {results.every(r => r.passed) && (
                        <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg text-center">
                          <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
                          <p className="text-accent font-medium">Congratulations! All tests passed!</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            You've successfully solved this challenge.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Challenge List */}
          <Card>
            <CardHeader>
              <CardTitle>Available Challenges</CardTitle>
              <p className="text-muted-foreground text-sm">Choose a challenge to solve</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {challenges?.map((challenge: any) => (
                  <button
                    key={challenge.id}
                    onClick={() => handleSelectChallenge(challenge.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedChallenge === challenge.id || (!selectedChallenge && challenge.id === challenges[0]?.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card hover:bg-muted border-border"
                    }`}
                    data-testid={`challenge-${challenge.id}`}
                  >
                    <div className="space-y-2">
                      <h4 className="font-medium">{challenge.title}</h4>
                      <p className="text-xs opacity-80 line-clamp-2">
                        {challenge.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        <span className="text-xs opacity-60">{challenge.category}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Daily Challenge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-accent" />
                <span>Daily Challenge</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">23h 45m remaining</span>
                </div>
                <p className="text-sm text-foreground font-medium">Array Manipulation</p>
                <p className="text-xs text-muted-foreground">
                  Complete today's challenge to maintain your streak!
                </p>
                <Button size="sm" className="w-full" data-testid="daily-challenge">
                  Start Daily Challenge
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Progress Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Challenges Solved</span>
                  <span className="text-sm font-medium">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="text-sm font-medium text-accent">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Favorite Category</span>
                  <Badge variant="secondary">Arrays</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Streak</span>
                  <span className="text-sm font-medium">7 days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hints */}
          {selectedChallengeData?.hints && (
            <Card>
              <CardHeader>
                <CardTitle>Hints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedChallengeData.hints.map((hint: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-muted-foreground">{hint}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
