import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  ChevronRight, 
  ChevronLeft,
  Lightbulb,
  Code,
  Zap,
  CheckCircle,
  Copy,
  Volume2,
  VolumeX
} from "lucide-react";

interface AnimationStep {
  id: string;
  title: string;
  description: string;
  code?: string;
  highlight?: string[];
  visual?: 'variable' | 'function' | 'array' | 'object' | 'loop' | 'condition';
  explanation: string;
  duration: number;
}

interface AnimatedLessonProps {
  title: string;
  concept: string;
  steps: AnimationStep[];
  onComplete?: () => void;
}

const visualComponents = {
  variable: (isActive: boolean, value?: string) => (
    <motion.div
      className={`p-4 rounded-lg border-2 ${isActive ? 'border-primary bg-primary/10' : 'border-muted bg-muted/5'}`}
      animate={isActive ? { scale: [1, 1.05, 1], transition: { duration: 0.5 } } : {}}
    >
      <div className="text-center">
        <div className="font-mono text-sm mb-2">let variable</div>
        <motion.div 
          className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold"
          animate={isActive ? { rotateY: [0, 180, 360] } : {}}
          transition={{ duration: 1 }}
        >
          {value || "42"}
        </motion.div>
      </div>
    </motion.div>
  ),
  
  function: (isActive: boolean) => (
    <motion.div
      className={`p-4 rounded-lg border-2 ${isActive ? 'border-primary bg-primary/10' : 'border-muted bg-muted/5'}`}
      animate={isActive ? { y: [0, -10, 0], transition: { duration: 0.8 } } : {}}
    >
      <div className="text-center">
        <div className="font-mono text-sm mb-2">function()</div>
        <div className="relative">
          <motion.div 
            className="w-20 h-12 rounded-lg bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-bold"
            animate={isActive ? { scaleX: [1, 1.2, 1] } : {}}
          >
            ƒ
          </motion.div>
          <motion.div
            className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-yellow-400"
            animate={isActive ? { scale: [0, 1.2, 0], opacity: [0, 1, 0] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>
  ),
  
  array: (isActive: boolean, items?: string[]) => (
    <motion.div
      className={`p-4 rounded-lg border-2 ${isActive ? 'border-primary bg-primary/10' : 'border-muted bg-muted/5'}`}
    >
      <div className="text-center">
        <div className="font-mono text-sm mb-2">array[]</div>
        <div className="flex space-x-2 justify-center">
          {(items || ['a', 'b', 'c']).map((item, index) => (
            <motion.div
              key={index}
              className="w-8 h-8 rounded bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold"
              initial={{ opacity: 0, scale: 0 }}
              animate={isActive ? { 
                opacity: 1, 
                scale: 1,
                transition: { delay: index * 0.2 }
              } : { opacity: 0.6 }}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  ),
  
  loop: (isActive: boolean) => (
    <motion.div
      className={`p-4 rounded-lg border-2 ${isActive ? 'border-primary bg-primary/10' : 'border-muted bg-muted/5'}`}
    >
      <div className="text-center">
        <div className="font-mono text-sm mb-2">for loop</div>
        <motion.div 
          className="w-16 h-16 mx-auto rounded-full border-4 border-orange-400 relative"
          animate={isActive ? { rotate: 360 } : {}}
          transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: "linear" }}
        >
          <motion.div 
            className="absolute top-1 right-1 w-3 h-3 rounded-full bg-orange-400"
            animate={isActive ? { scale: [1, 1.5, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </motion.div>
  ),
  
  condition: (isActive: boolean) => (
    <motion.div
      className={`p-4 rounded-lg border-2 ${isActive ? 'border-primary bg-primary/10' : 'border-muted bg-muted/5'}`}
    >
      <div className="text-center">
        <div className="font-mono text-sm mb-2">if statement</div>
        <div className="relative">
          <motion.div 
            className="w-16 h-16 mx-auto"
            animate={isActive ? { rotateY: [0, 180] } : {}}
            transition={{ duration: 1, repeat: isActive ? Infinity : 0, repeatDelay: 1 }}
          >
            <div className="w-full h-full rounded-lg bg-gradient-to-br from-red-400 to-green-400 flex items-center justify-center text-white font-bold text-lg">
              ?
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
};

export function AnimatedLesson({ title, concept, steps, onComplete }: AnimatedLessonProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentStep < steps.length) {
      const step = steps[currentStep];
      const progressIncrement = 100 / (step.duration * 10); // Update every 100ms
      
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + progressIncrement;
          if (newProgress >= 100) {
            nextStep();
            return 0;
          }
          return newProgress;
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setProgress(0);
    } else {
      setIsPlaying(false);
      onComplete?.();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setProgress(0);
    }
  };

  const resetAnimation = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentStepData = steps[currentStep];
  const Visual = currentStepData?.visual ? visualComponents[currentStepData.visual] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-primary" />
                <span>{title}</span>
              </CardTitle>
              <p className="text-muted-foreground mt-1">Interactive concept: {concept}</p>
            </div>
            <Badge variant="secondary">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Animation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Animation */}
        <Card className="h-80">
          <CardHeader>
            <CardTitle className="text-lg">Visual Concept</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                {Visual && Visual(isPlaying, currentStepData?.code)}
                <motion.h3 
                  className="mt-4 font-semibold text-lg"
                  animate={isPlaying ? { color: ['#6366f1', '#8b5cf6', '#6366f1'] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentStepData?.title}
                </motion.h3>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Code and Explanation */}
        <Card className="h-80">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>Code Example</span>
              {currentStepData?.code && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(currentStepData.code || '')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Code Block */}
            {currentStepData?.code && (
              <motion.div 
                className="bg-secondary rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <pre className="text-sm font-mono text-foreground overflow-x-auto">
                  <code>{currentStepData.code}</code>
                </pre>
              </motion.div>
            )}
            
            {/* Explanation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-4 w-4 text-accent" />
                <h4 className="font-medium">Explanation</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {currentStepData?.explanation}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Animation Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <Button onClick={togglePlayPause} size="lg">
                {isPlaying ? (
                  <Pause className="h-5 w-5 mr-2" />
                ) : (
                  <Play className="h-5 w-5 mr-2" />
                )}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetAnimation}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Step Description */}
            <motion.div 
              className="text-center p-4 bg-muted/30 rounded-lg"
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm text-muted-foreground">
                {currentStepData?.description}
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Completion */}
      {currentStep === steps.length - 1 && !isPlaying && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 bg-accent/10 border border-accent/20 rounded-lg"
        >
          <CheckCircle className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Concept Mastered! 🎉</h3>
          <p className="text-muted-foreground mb-4">
            You've completed the animated lesson on {concept}. Ready for the next challenge?
          </p>
          <Button onClick={onComplete}>
            Continue to Next Lesson
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// Sample lesson data
export const sampleAnimatedLessons = {
  variables: {
    title: "Understanding Variables",
    concept: "Variable Declaration and Assignment",
    steps: [
      {
        id: "1",
        title: "Declaring a Variable",
        description: "We start by declaring a variable using the 'let' keyword",
        code: "let message;",
        visual: "variable" as const,
        explanation: "This creates a variable named 'message' but doesn't give it a value yet. It's like creating an empty box with a label.",
        duration: 3
      },
      {
        id: "2", 
        title: "Assigning a Value",
        description: "Now we assign a value to our variable",
        code: "let message = 'Hello World!';",
        visual: "variable" as const,
        explanation: "The equals sign (=) is the assignment operator. It puts the value 'Hello World!' into our variable box.",
        duration: 3
      },
      {
        id: "3",
        title: "Using the Variable", 
        description: "We can now use the variable in our code",
        code: "console.log(message); // Outputs: Hello World!",
        visual: "variable" as const,
        explanation: "When we use the variable name, JavaScript retrieves the value we stored and uses it in the operation.",
        duration: 3
      }
    ]
  },
  
  functions: {
    title: "Functions in Action",
    concept: "Function Declaration and Execution",
    steps: [
      {
        id: "1",
        title: "Declaring a Function",
        description: "Functions are reusable blocks of code",
        code: "function greet(name) {\n  return 'Hello, ' + name + '!';\n}",
        visual: "function" as const,
        explanation: "This creates a function that takes a parameter 'name' and returns a greeting message.",
        duration: 4
      },
      {
        id: "2",
        title: "Calling the Function",
        description: "Now we execute our function with an argument",
        code: "greet('Alice'); // Returns: 'Hello, Alice!'",
        visual: "function" as const,
        explanation: "When we call the function with 'Alice', it processes the input and returns the personalized greeting.",
        duration: 3
      }
    ]
  }
};
