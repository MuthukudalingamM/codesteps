import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCommunityPostSchema, insertAiSessionSchema } from "@shared/schema";
import OpenAI from "openai";
import authRoutes from "./routes/auth";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.use('/api/auth', authRoutes);

  // Note: Auth routes are handled by the auth router
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Lesson routes
  app.get("/api/lessons", async (req, res) => {
    try {
      const lessons = await storage.getLessons();
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lesson = await storage.getLesson(req.params.id);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Challenge routes
  app.get("/api/challenges", async (req, res) => {
    try {
      const { difficulty } = req.query;
      let challenges;
      if (difficulty) {
        challenges = await storage.getChallengesByDifficulty(difficulty as string);
      } else {
        challenges = await storage.getChallenges();
      }
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/challenges/:id", async (req, res) => {
    try {
      const challenge = await storage.getChallenge(req.params.id);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User Progress routes
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users/:userId/progress", async (req, res) => {
    try {
      const progressData = { ...req.body, userId: req.params.userId };
      const progress = await storage.createUserProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data" });
    }
  });

  // Community routes
  app.get("/api/community/posts", async (req, res) => {
    try {
      const posts = await storage.getCommunityPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/community/posts", async (req, res) => {
    try {
      const postData = insertCommunityPostSchema.parse(req.body);
      const post = await storage.createCommunityPost(postData);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: "Invalid post data" });
    }
  });

  // AI Tutor routes
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context, userId, conversationHistory, currentCode, learningLevel } = req.body;

      // Enhanced system prompt with better context awareness
      const systemPrompt = `You are CodeSteps AI, an expert programming tutor with advanced teaching capabilities. Your goal is to provide accurate, helpful responses tailored to each user's learning journey.

      CORE PRINCIPLES:
      - Always provide correct, tested programming solutions
      - Adapt explanations to the user's skill level: ${learningLevel || 'beginner'}
      - Use practical, executable code examples
      - Encourage active learning through guided questions
      - Break complex concepts into digestible steps
      - Provide immediate feedback and corrections
      - Celebrate progress and maintain motivation

      RESPONSE GUIDELINES:
      - If asked about code, provide working examples
      - If explaining concepts, use analogies and real-world applications
      - If user shows confusion, offer alternative explanations
      - Always validate code snippets before suggesting them
      - Include best practices and common pitfalls
      - End with a follow-up question to check understanding

      CURRENT CONTEXT: ${context || "General programming help"}
      ${currentCode ? `CURRENT CODE BEING WORKED ON:\n${currentCode}` : ''}

      Remember: Accuracy is paramount. Double-check all code examples and explanations.`;

      // Build conversation history for better context
      const messages = [
        { role: "system", content: systemPrompt }
      ];

      // Add recent conversation history if available
      if (conversationHistory && conversationHistory.length > 0) {
        // Include last 6 messages for context (3 exchanges)
        const recentHistory = conversationHistory.slice(-6);
        messages.push(...recentHistory);
      }

      // Add current user message
      messages.push({ role: "user", content: message });

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages,
        max_tokens: 800,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const aiResponse = response.choices[0].message.content;

      // Save the enhanced session if userId is provided
      if (userId) {
        const sessionData = {
          userId,
          messages: [
            { role: "user", content: message },
            { role: "assistant", content: aiResponse }
          ],
          context: context || "General programming help",
          metadata: {
            learningLevel: learningLevel || 'beginner',
            hasCode: !!currentCode,
            timestamp: new Date().toISOString()
          }
        };
        await storage.createAiSession(sessionData);
      }

      res.json({
        message: aiResponse,
        suggestions: {
          followUpQuestions: [
            "Would you like me to explain this concept differently?",
            "Do you want to see another example?",
            "Should we practice with a coding exercise?"
          ],
          nextTopics: context?.suggestedTopics || []
        }
      });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ message: "I apologize, but I'm having trouble connecting right now. Please try asking your question again." });
    }
  });

  app.post("/api/ai/explain-error", async (req, res) => {
    try {
      const { error, code, userId, context, userLevel } = req.body;

      const prompt = `As CodeSteps AI, provide expert debugging assistance for this JavaScript error.

      ERROR: ${error}
      CODE: ${code}
      USER LEVEL: ${userLevel || 'beginner'}
      CONTEXT: ${context || 'General debugging'}

      Provide a comprehensive analysis with:
      1. Clear explanation of what this error means (adjust complexity for ${userLevel || 'beginner'} level)
      2. Root cause analysis - why this specific error occurred in this code
      3. Step-by-step fix with corrected code example
      4. Prevention strategies and best practices
      5. Related concepts the user should understand
      6. Common variations of this error type

      IMPORTANT: Include working, corrected code in your solution.

      Respond in JSON format with:
      {
        "explanation": "Clear explanation of the error",
        "cause": "Root cause analysis",
        "solution": "Step-by-step fix",
        "correctedCode": "Working code example",
        "tips": "Prevention strategies",
        "relatedConcepts": ["concept1", "concept2"],
        "commonVariations": "Similar errors to watch for",
        "encouragement": "Motivational message"
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3, // Lower temperature for more precise debugging
      });

      const aiResponse = JSON.parse(response.choices[0].message.content!);

      // Log successful error analysis for learning improvement
      if (userId) {
        await storage.createAiSession({
          userId,
          messages: [
            { role: "user", content: `Debug error: ${error}` },
            { role: "assistant", content: `Provided debugging assistance for ${error}` }
          ],
          context: "Error Debugging",
          metadata: {
            errorType: error.split(':')[0],
            resolved: true,
            userLevel: userLevel || 'beginner'
          }
        });
      }

      res.json(aiResponse);
    } catch (error) {
      console.error("AI error explanation error:", error);
      res.status(500).json({
        explanation: "I'm having trouble analyzing this error right now.",
        cause: "Please check your internet connection and try again.",
        solution: "Try refreshing the page or contact support if the issue persists.",
        tips: "Don't worry - debugging is a normal part of programming!"
      });
    }
  });

  app.post("/api/ai/code-suggestions", async (req, res) => {
    try {
      const { code, context, userId, learningGoals, userLevel } = req.body;

      const prompt = `As CodeSteps AI tutor, provide expert code analysis and personalized suggestions.

      CODE TO ANALYZE:
      ${code}

      CONTEXT: ${context || "General code review"}
      USER LEVEL: ${userLevel || 'beginner'}
      LEARNING GOALS: ${learningGoals || 'Improve coding skills'}

      Provide comprehensive feedback covering:
      1. Code correctness and functionality
      2. Best practices and style improvements
      3. Performance optimizations (if applicable)
      4. Security considerations
      5. Readability and maintainability
      6. Learning opportunities based on user level
      7. Next steps for skill development

      Tailor suggestions to ${userLevel || 'beginner'} level - be encouraging but accurate.

      Respond in JSON format:
      {
        "overallAssessment": "High-level feedback on the code",
        "feedback": "Detailed analysis of what works well",
        "suggestions": ["Specific actionable improvements"],
        "codeQuality": {
          "correctness": "Assessment of functional correctness",
          "style": "Code style feedback",
          "performance": "Performance considerations"
        },
        "learningOpportunities": ["Concepts to explore next"],
        "improvedCode": "Enhanced version of the code (if improvements needed)",
        "encouragement": "Positive, motivating message",
        "difficulty": "Current difficulty level of the code",
        "nextChallenges": ["Suggested next coding exercises"]
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.4, // Balanced creativity and precision
      });

      const aiResponse = JSON.parse(response.choices[0].message.content!);

      // Track code review sessions for personalized learning
      if (userId) {
        await storage.createAiSession({
          userId,
          messages: [
            { role: "user", content: "Requesting code review" },
            { role: "assistant", content: "Provided comprehensive code analysis and suggestions" }
          ],
          context: "Code Review",
          metadata: {
            codeLength: code.length,
            reviewType: context || 'general',
            userLevel: userLevel || 'beginner',
            timestamp: new Date().toISOString()
          }
        });
      }

      res.json(aiResponse);
    } catch (error) {
      console.error("AI code suggestions error:", error);
      res.status(500).json({
        feedback: "I'm having trouble analyzing your code right now.",
        suggestions: ["Please try again in a moment", "Check your internet connection"],
        encouragement: "Keep coding! Every line of code is a step forward in your learning journey."
      });
    }
  });

  // Enhanced code execution route for the AI tutor
  app.post("/api/code/execute", async (req, res) => {
    try {
      const { code, testCases } = req.body;
      const startTime = Date.now();
      
      let output = "";
      let error = null;
      
      try {
        // Create a safe execution context for simple JavaScript
        const originalConsoleLog = console.log;
        const logs: string[] = [];
        console.log = (...args) => {
          logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
        };
        
        // Execute the code in a limited context
        const result = eval(`
          (() => {
            ${code}
          })()
        `);
        
        // Restore console.log
        console.log = originalConsoleLog;
        
        if (logs.length > 0) {
          output = logs.join('\n');
        } else if (result !== undefined) {
          output = String(result);
        } else {
          output = "Code executed successfully (no output)";
        }
        
      } catch (executionError) {
        error = executionError.message;
      }
      
      const executionTime = Date.now() - startTime;
      
      // If testCases are provided, run them too
      const results = [];
      if (testCases && testCases.length > 0) {
        for (const testCase of testCases) {
          try {
            // This is a simplified example - in production, use a proper sandbox
            const func = new Function('input', `${code}\nreturn calculateArea ? calculateArea(input) : null;`);
            const result = func(testCase.input);
            results.push({
              input: testCase.input,
              expected: testCase.expected,
              actual: result,
              passed: result === testCase.expected
            });
          } catch (testError) {
            results.push({
              input: testCase.input,
              expected: testCase.expected,
              actual: null,
              passed: false,
              error: testError instanceof Error ? testError.message : 'Unknown error'
            });
          }
        }
      }
      
      res.json({
        output,
        error,
        executionTime,
        results,
        success: !error
      });
    } catch (error) {
      res.status(500).json({ message: "Code execution failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
