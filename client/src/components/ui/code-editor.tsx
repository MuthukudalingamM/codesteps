import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  title?: string;
  onRun?: () => void;
  onReset?: () => void;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  height = "400px",
  title = "Code Editor",
  onRun,
  onReset,
  readOnly = false
}: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Simple code editor implementation
  // In a real application, you would integrate Monaco Editor here
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center space-x-2">
            {onReset && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onReset}
                data-testid="code-reset"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
            {onRun && (
              <Button 
                size="sm" 
                onClick={onRun}
                className="bg-accent hover:bg-accent/90"
                data-testid="code-run"
              >
                <Play className="h-4 w-4 mr-2" />
                Run Code
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-secondary rounded-lg p-4 font-mono text-sm" style={{ height }}>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <div className="flex space-x-4 text-xs text-muted-foreground">
              <span>main.js</span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-accent">
                <span className="inline-block w-2 h-2 bg-accent rounded-full mr-1"></span>
                {language}
              </span>
            </div>
          </div>
          <textarea
            ref={editorRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full bg-transparent border-none outline-none resize-none font-mono text-sm text-foreground"
            placeholder="// Start coding here..."
            readOnly={readOnly}
            data-testid="code-textarea"
          />
        </div>
      </CardContent>
    </Card>
  );
}
