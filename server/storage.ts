import { 
  type User, 
  type InsertUser,
  type Lesson,
  type InsertLesson,
  type Challenge,
  type InsertChallenge,
  type UserProgress,
  type InsertUserProgress,
  type CommunityPost,
  type InsertCommunityPost,
  type AiSession,
  type InsertAiSession
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Lesson methods
  getLessons(): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson | undefined>;

  // Challenge methods
  getChallenges(): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge | undefined>;
  getChallengesByDifficulty(difficulty: string): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;

  // User Progress methods
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressForLesson(userId: string, lessonId: string): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined>;

  // Community methods
  getCommunityPosts(): Promise<CommunityPost[]>;
  getCommunityPost(id: string): Promise<CommunityPost | undefined>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  updateCommunityPost(id: string, updates: Partial<CommunityPost>): Promise<CommunityPost | undefined>;

  // AI Session methods
  getAiSession(id: string): Promise<AiSession | undefined>;
  getUserAiSessions(userId: string): Promise<AiSession[]>;
  createAiSession(session: InsertAiSession): Promise<AiSession>;
  updateAiSession(id: string, updates: Partial<AiSession>): Promise<AiSession | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private lessons: Map<string, Lesson>;
  private challenges: Map<string, Challenge>;
  private userProgress: Map<string, UserProgress>;
  private communityPosts: Map<string, CommunityPost>;
  private aiSessions: Map<string, AiSession>;

  constructor() {
    this.users = new Map();
    this.lessons = new Map();
    this.challenges = new Map();
    this.userProgress = new Map();
    this.communityPosts = new Map();
    this.aiSessions = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize default lessons
    const defaultLessons: Lesson[] = [
      {
        id: "1",
        title: "Introduction to JavaScript",
        description: "Learn the basics of JavaScript programming",
        content: "JavaScript is a versatile programming language...",
        codeExample: "console.log('Hello, World!');",
        difficulty: "beginner",
        category: "fundamentals",
        order: 1,
        isCompleted: false,
      },
      {
        id: "2",
        title: "Variables & Data Types",
        description: "Understanding variables and different data types",
        content: "Variables are containers for storing data values...",
        codeExample: "let name = 'John';\nconst age = 25;\nvar isStudent = true;",
        difficulty: "beginner",
        category: "fundamentals",
        order: 2,
        isCompleted: false,
      },
      {
        id: "3",
        title: "JavaScript Functions",
        description: "Learn about function declarations, expressions, and arrow functions",
        content: "Functions are reusable blocks of code that perform specific tasks...",
        codeExample: "function greetUser(name) {\n  return `Hello, ${name}!`;\n}",
        difficulty: "beginner",
        category: "fundamentals",
        order: 3,
        isCompleted: false,
      },
    ];

    defaultLessons.forEach(lesson => this.lessons.set(lesson.id, lesson));

    // Initialize default challenges
    const defaultChallenges: Challenge[] = [
      {
        id: "1",
        title: "Array Manipulation",
        description: "Find the second largest number in an array without sorting",
        difficulty: "medium",
        category: "arrays",
        testCases: [
          { input: [1, 3, 4, 5, 2], expected: 4 },
          { input: [10, 20, 30], expected: 20 },
        ],
        solution: "function findSecondLargest(arr) {\n  let first = arr[0], second = -1;\n  for (let i = 1; i < arr.length; i++) {\n    if (arr[i] > first) {\n      second = first;\n      first = arr[i];\n    } else if (arr[i] > second && arr[i] < first) {\n      second = arr[i];\n    }\n  }\n  return second;\n}",
        hints: ["Think about tracking two variables", "Don't sort the array"],
      },
    ];

    defaultChallenges.forEach(challenge => this.challenges.set(challenge.id, challenge));

    // Initialize sample community posts
    const defaultPosts: CommunityPost[] = [
      {
        id: "1",
        userId: "sample-user",
        title: "Can someone explain the difference between let and const?",
        content: "I'm having trouble understanding when to use let vs const in JavaScript.",
        category: "questions",
        likes: 5,
        replies: 3,
        createdAt: new Date(),
      },
      {
        id: "2",
        userId: "sample-user-2",
        title: "Just completed my first JavaScript project!",
        content: "Thanks to the AI tutor for the helpful explanations.",
        category: "achievements",
        likes: 12,
        replies: 1,
        createdAt: new Date(),
      },
    ];

    defaultPosts.forEach(post => this.communityPosts.set(post.id, post));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      skillLevel: "beginner",
      currentStreak: 0,
      totalLessons: 3,
      completedLessons: 0,
      challengesSolved: 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Lesson methods
  async getLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).sort((a, b) => a.order - b.order);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = randomUUID();
    const lesson: Lesson = { 
      ...insertLesson, 
      id,
      difficulty: insertLesson.difficulty || "beginner",
      codeExample: insertLesson.codeExample || null,
      isCompleted: insertLesson.isCompleted || false
    };
    this.lessons.set(id, lesson);
    return lesson;
  }

  async updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson | undefined> {
    const lesson = this.lessons.get(id);
    if (!lesson) return undefined;
    
    const updatedLesson = { ...lesson, ...updates };
    this.lessons.set(id, updatedLesson);
    return updatedLesson;
  }

  // Challenge methods
  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async getChallengesByDifficulty(difficulty: string): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(c => c.difficulty === difficulty);
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = randomUUID();
    const challenge: Challenge = { 
      ...insertChallenge, 
      id,
      testCases: insertChallenge.testCases || null,
      solution: insertChallenge.solution || null,
      hints: insertChallenge.hints || null
    };
    this.challenges.set(id, challenge);
    return challenge;
  }

  // User Progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(p => p.userId === userId);
  }

  async getUserProgressForLesson(userId: string, lessonId: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(p => p.userId === userId && p.lessonId === lessonId);
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const progress: UserProgress = { 
      ...insertProgress, 
      id,
      status: insertProgress.status || "not_started",
      lessonId: insertProgress.lessonId || null,
      challengeId: insertProgress.challengeId || null,
      completedAt: insertProgress.completedAt || null,
      score: insertProgress.score || null
    };
    this.userProgress.set(id, progress);
    return progress;
  }

  async updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const progress = this.userProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updates };
    this.userProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  // Community methods
  async getCommunityPosts(): Promise<CommunityPost[]> {
    return Array.from(this.communityPosts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getCommunityPost(id: string): Promise<CommunityPost | undefined> {
    return this.communityPosts.get(id);
  }

  async createCommunityPost(insertPost: InsertCommunityPost): Promise<CommunityPost> {
    const id = randomUUID();
    const post: CommunityPost = { 
      ...insertPost, 
      id,
      likes: 0,
      replies: 0,
      createdAt: new Date(),
    };
    this.communityPosts.set(id, post);
    return post;
  }

  async updateCommunityPost(id: string, updates: Partial<CommunityPost>): Promise<CommunityPost | undefined> {
    const post = this.communityPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...updates };
    this.communityPosts.set(id, updatedPost);
    return updatedPost;
  }

  // AI Session methods
  async getAiSession(id: string): Promise<AiSession | undefined> {
    return this.aiSessions.get(id);
  }

  async getUserAiSessions(userId: string): Promise<AiSession[]> {
    return Array.from(this.aiSessions.values()).filter(s => s.userId === userId);
  }

  async createAiSession(insertSession: InsertAiSession): Promise<AiSession> {
    const id = randomUUID();
    const session: AiSession = { 
      ...insertSession, 
      id,
      context: insertSession.context || null,
      messages: insertSession.messages || null,
      createdAt: new Date(),
    };
    this.aiSessions.set(id, session);
    return session;
  }

  async updateAiSession(id: string, updates: Partial<AiSession>): Promise<AiSession | undefined> {
    const session = this.aiSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.aiSessions.set(id, updatedSession);
    return updatedSession;
  }
}

export const storage = new MemStorage();
