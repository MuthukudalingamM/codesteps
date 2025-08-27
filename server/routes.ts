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
      const { message, context, userId } = req.body;
      
      const systemPrompt = `You are CodeSteps AI, a friendly and encouraging programming tutor. Help users learn programming concepts step by step. 
      - Provide clear, beginner-friendly explanations
      - Use practical examples when possible
      - Encourage the user and celebrate their progress
      - Break down complex topics into smaller, manageable pieces
      - Ask follow-up questions to ensure understanding
      
      Context: ${context || "General programming help"}`;

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
      });

      const aiResponse = response.choices[0].message.content;

      // Save the session if userId is provided
      if (userId) {
        await storage.createAiSession({
          userId,
          messages: [
            { role: "user", content: message },
            { role: "assistant", content: aiResponse }
          ],
          context: context || "General programming help"
        });
      }

      res.json({ message: aiResponse });
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  app.post("/api/ai/explain-error", async (req, res) => {
    try {
      const { error, code, userId } = req.body;
      
      const prompt = `As CodeSteps AI tutor, help debug this JavaScript error:
      
      Error: ${error}
      Code: ${code}
      
      Please provide:
      1. A clear explanation of what this error means
      2. Why it occurred in this specific code
      3. Step-by-step solution to fix it
      4. Tips to prevent similar errors
      
      Respond in JSON format with: { "explanation": "...", "cause": "...", "solution": "...", "tips": "..." }`;

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const aiResponse = JSON.parse(response.choices[0].message.content!);
      res.json(aiResponse);
    } catch (error) {
      console.error("AI error explanation error:", error);
      res.status(500).json({ message: "Failed to explain error" });
    }
  });

  app.post("/api/ai/code-suggestions", async (req, res) => {
    try {
      const { code, context, userId } = req.body;
      
      const prompt = `As CodeSteps AI tutor, analyze this JavaScript code and provide helpful suggestions:
      
      Code: ${code}
      Context: ${context || "General code review"}
      
      Please provide constructive feedback focusing on:
      1. Code quality and best practices
      2. Potential improvements
      3. Learning opportunities
      4. Positive reinforcement
      
      Respond in JSON format with: { "feedback": "...", "suggestions": ["..."], "encouragement": "..." }`;

      const response = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const aiResponse = JSON.parse(response.choices[0].message.content!);
      res.json(aiResponse);
    } catch (error) {
      console.error("AI code suggestions error:", error);
      res.status(500).json({ message: "Failed to get code suggestions" });
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
