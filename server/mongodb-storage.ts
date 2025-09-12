import { 
  User, 
  Session, 
  Lesson, 
  Challenge, 
  UserProgress, 
  CommunityPost, 
  AiSession,
  type UserDoc,
  type LessonDoc,
  type ChallengeDoc,
  type UserProgressDoc,
  type CommunityPostDoc,
  type AiSessionDoc,
  type InsertUser,
  type InsertLesson,
  type InsertChallenge,
  type InsertUserProgress,
  type InsertCommunityPost,
  type InsertAiSession
} from "@shared/mongodb-schema";
import { connectToMongoDB } from "./mongodb";

// MongoDB Storage Implementation
export class MongoStorage {
  
  constructor() {
    // Ensure MongoDB connection
    this.connect();
  }

  private async connect() {
    try {
      await connectToMongoDB();
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  // Convert MongoDB document to plain object (removing _id and __v)
  private toPlainUser(doc: any): any {
    return {
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      password: doc.password,
      phone: doc.phone,
      skillLevel: doc.skillLevel,
      currentStreak: doc.currentStreak,
      totalLessons: doc.totalLessons,
      completedLessons: doc.completedLessons,
      challengesSolved: doc.challengesSolved,
      isEmailVerified: doc.isEmailVerified,
      isPhoneVerified: doc.isPhoneVerified,
      emailVerificationToken: doc.emailVerificationToken,
      phoneVerificationCode: doc.phoneVerificationCode,
      createdAt: doc.createdAt,
    };
  }

  private toPlainLesson(doc: any): any {
    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      content: doc.content,
      codeExample: doc.codeExample,
      difficulty: doc.difficulty,
      category: doc.category,
      order: doc.order,
      isCompleted: doc.isCompleted,
    };
  }

  private toPlainChallenge(doc: any): any {
    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      difficulty: doc.difficulty,
      category: doc.category,
      testCases: doc.testCases,
      solution: doc.solution,
      hints: doc.hints,
    };
  }

  private toPlainUserProgress(doc: any): any {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      lessonId: doc.lessonId,
      challengeId: doc.challengeId,
      status: doc.status,
      completedAt: doc.completedAt,
      score: doc.score,
    };
  }

  private toPlainCommunityPost(doc: any): any {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      title: doc.title,
      content: doc.content,
      category: doc.category,
      likes: doc.likes,
      replies: doc.replies,
      createdAt: doc.createdAt,
    };
  }

  private toPlainAiSession(doc: any): any {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      messages: doc.messages,
      context: doc.context,
      createdAt: doc.createdAt,
    };
  }

  // User methods
  async getUser(id: string): Promise<any | undefined> {
    try {
      const user = await User.findById(id);
      return user ? this.toPlainUser(user as any) : undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    try {
      const user = await User.findOne({ username });
      return user ? this.toPlainUser(user as any) : undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<any | undefined> {
    try {
      const user = await User.findOne({ email });
      return user ? this.toPlainUser(user as any) : undefined;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<any> {
    try {
      const newUser = new User(user);
      const savedUser = await newUser.save();
      return this.toPlainUser(savedUser as any);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<any>): Promise<any | undefined> {
    try {
      const user = await User.findByIdAndUpdate(id, updates, { new: true });
      return user ? this.toPlainUser(user as any) : undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  // Lesson methods
  async getLessons(): Promise<any[]> {
    try {
      const lessons = await Lesson.find().sort({ order: 1 });
      return lessons.map(lesson => this.toPlainLesson(lesson as LessonDoc));
    } catch (error) {
      console.error('Error getting lessons:', error);
      return [];
    }
  }

  async getLesson(id: string): Promise<any | undefined> {
    try {
      const lesson = await Lesson.findById(id);
      return lesson ? this.toPlainLesson(lesson as LessonDoc) : undefined;
    } catch (error) {
      console.error('Error getting lesson:', error);
      return undefined;
    }
  }

  async createLesson(lesson: InsertLesson): Promise<any> {
    try {
      const newLesson = new Lesson(lesson);
      const savedLesson = await newLesson.save();
      return this.toPlainLesson(savedLesson as LessonDoc);
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  }

  async updateLesson(id: string, updates: Partial<any>): Promise<any | undefined> {
    try {
      const lesson = await Lesson.findByIdAndUpdate(id, updates, { new: true });
      return lesson ? this.toPlainLesson(lesson as LessonDoc) : undefined;
    } catch (error) {
      console.error('Error updating lesson:', error);
      return undefined;
    }
  }

  // Challenge methods
  async getChallenges(): Promise<any[]> {
    try {
      const challenges = await Challenge.find();
      return challenges.map(challenge => this.toPlainChallenge(challenge as ChallengeDoc));
    } catch (error) {
      console.error('Error getting challenges:', error);
      return [];
    }
  }

  async getChallenge(id: string): Promise<any | undefined> {
    try {
      const challenge = await Challenge.findById(id);
      return challenge ? this.toPlainChallenge(challenge as ChallengeDoc) : undefined;
    } catch (error) {
      console.error('Error getting challenge:', error);
      return undefined;
    }
  }

  async getChallengesByDifficulty(difficulty: string): Promise<any[]> {
    try {
      const challenges = await Challenge.find({ difficulty });
      return challenges.map(challenge => this.toPlainChallenge(challenge as ChallengeDoc));
    } catch (error) {
      console.error('Error getting challenges by difficulty:', error);
      return [];
    }
  }

  async createChallenge(challenge: InsertChallenge): Promise<any> {
    try {
      const newChallenge = new Challenge(challenge);
      const savedChallenge = await newChallenge.save();
      return this.toPlainChallenge(savedChallenge as ChallengeDoc);
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }
  }

  // User Progress methods
  async getUserProgress(userId: string): Promise<any[]> {
    try {
      const progress = await UserProgress.find({ userId });
      return progress.map(p => this.toPlainUserProgress(p as UserProgressDoc));
    } catch (error) {
      console.error('Error getting user progress:', error);
      return [];
    }
  }

  async getUserProgressForLesson(userId: string, lessonId: string): Promise<any | undefined> {
    try {
      const progress = await UserProgress.findOne({ userId, lessonId });
      return progress ? this.toPlainUserProgress(progress as UserProgressDoc) : undefined;
    } catch (error) {
      console.error('Error getting user progress for lesson:', error);
      return undefined;
    }
  }

  async createUserProgress(progress: InsertUserProgress): Promise<any> {
    try {
      const newProgress = new UserProgress(progress);
      const savedProgress = await newProgress.save();
      return this.toPlainUserProgress(savedProgress as UserProgressDoc);
    } catch (error) {
      console.error('Error creating user progress:', error);
      throw error;
    }
  }

  async updateUserProgress(id: string, updates: Partial<any>): Promise<any | undefined> {
    try {
      const progress = await UserProgress.findByIdAndUpdate(id, updates, { new: true });
      return progress ? this.toPlainUserProgress(progress as UserProgressDoc) : undefined;
    } catch (error) {
      console.error('Error updating user progress:', error);
      return undefined;
    }
  }

  // Community methods
  async getCommunityPosts(): Promise<any[]> {
    try {
      const posts = await CommunityPost.find().sort({ createdAt: -1 });
      return posts.map(post => this.toPlainCommunityPost(post as CommunityPostDoc));
    } catch (error) {
      console.error('Error getting community posts:', error);
      return [];
    }
  }

  async getCommunityPost(id: string): Promise<any | undefined> {
    try {
      const post = await CommunityPost.findById(id);
      return post ? this.toPlainCommunityPost(post as CommunityPostDoc) : undefined;
    } catch (error) {
      console.error('Error getting community post:', error);
      return undefined;
    }
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<any> {
    try {
      const newPost = new CommunityPost(post);
      const savedPost = await newPost.save();
      return this.toPlainCommunityPost(savedPost as CommunityPostDoc);
    } catch (error) {
      console.error('Error creating community post:', error);
      throw error;
    }
  }

  async updateCommunityPost(id: string, updates: Partial<any>): Promise<any | undefined> {
    try {
      const post = await CommunityPost.findByIdAndUpdate(id, updates, { new: true });
      return post ? this.toPlainCommunityPost(post as CommunityPostDoc) : undefined;
    } catch (error) {
      console.error('Error updating community post:', error);
      return undefined;
    }
  }

  // AI Session methods
  async getAiSession(id: string): Promise<any | undefined> {
    try {
      const session = await AiSession.findById(id);
      return session ? this.toPlainAiSession(session as AiSessionDoc) : undefined;
    } catch (error) {
      console.error('Error getting AI session:', error);
      return undefined;
    }
  }

  async getUserAiSessions(userId: string): Promise<any[]> {
    try {
      const sessions = await AiSession.find({ userId }).sort({ createdAt: -1 });
      return sessions.map(session => this.toPlainAiSession(session as AiSessionDoc));
    } catch (error) {
      console.error('Error getting user AI sessions:', error);
      return [];
    }
  }

  async createAiSession(session: InsertAiSession): Promise<any> {
    try {
      const newSession = new AiSession(session);
      const savedSession = await newSession.save();
      return this.toPlainAiSession(savedSession as AiSessionDoc);
    } catch (error) {
      console.error('Error creating AI session:', error);
      throw error;
    }
  }

  async updateAiSession(id: string, updates: Partial<any>): Promise<any | undefined> {
    try {
      const session = await AiSession.findByIdAndUpdate(id, updates, { new: true });
      return session ? this.toPlainAiSession(session as AiSessionDoc) : undefined;
    } catch (error) {
      console.error('Error updating AI session:', error);
      return undefined;
    }
  }
}