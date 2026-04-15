import { eq, and } from "drizzle-orm";
import { db } from "./db";
import {
  users, lessons, challenges, userProgress, communityPosts, aiSessions,
  type User, type InsertUser,
  type Lesson, type InsertLesson,
  type Challenge, type InsertChallenge,
  type UserProgress, type InsertUserProgress,
  type CommunityPost, type InsertCommunityPost,
  type AiSession, type InsertAiSession,
} from "@shared/schema";
import { randomUUID } from "crypto";
import type { IStorage } from "./storage";

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [updated] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return updated;
  }

  // Lesson methods
  async getLessons(): Promise<Lesson[]> {
    return db.select().from(lessons).orderBy(lessons.order);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [created] = await db.insert(lessons).values(lesson).returning();
    return created;
  }

  async updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson | undefined> {
    const [updated] = await db.update(lessons).set(updates).where(eq(lessons.id, id)).returning();
    return updated;
  }

  // Challenge methods
  async getChallenges(): Promise<Challenge[]> {
    return db.select().from(challenges);
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
    return challenge;
  }

  async getChallengesByDifficulty(difficulty: string): Promise<Challenge[]> {
    return db.select().from(challenges).where(eq(challenges.difficulty, difficulty));
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const [created] = await db.insert(challenges).values(challenge).returning();
    return created;
  }

  // User Progress methods
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async getUserProgressForLesson(userId: string, lessonId: string): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress).where(
      and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId))
    );
    return progress;
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [created] = await db.insert(userProgress).values(progress).returning();
    return created;
  }

  async updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const [updated] = await db.update(userProgress).set(updates).where(eq(userProgress.id, id)).returning();
    return updated;
  }

  // Community methods
  async getCommunityPosts(): Promise<CommunityPost[]> {
    return db.select().from(communityPosts);
  }

  async getCommunityPost(id: string): Promise<CommunityPost | undefined> {
    const [post] = await db.select().from(communityPosts).where(eq(communityPosts.id, id));
    return post;
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const [created] = await db.insert(communityPosts).values(post).returning();
    return created;
  }

  async updateCommunityPost(id: string, updates: Partial<CommunityPost>): Promise<CommunityPost | undefined> {
    const [updated] = await db.update(communityPosts).set(updates).where(eq(communityPosts.id, id)).returning();
    return updated;
  }

  // AI Session methods
  async getAiSession(id: string): Promise<AiSession | undefined> {
    const [session] = await db.select().from(aiSessions).where(eq(aiSessions.id, id));
    return session;
  }

  async getUserAiSessions(userId: string): Promise<AiSession[]> {
    return db.select().from(aiSessions).where(eq(aiSessions.userId, userId));
  }

  async createAiSession(session: InsertAiSession): Promise<AiSession> {
    const [created] = await db.insert(aiSessions).values(session).returning();
    return created;
  }

  async updateAiSession(id: string, updates: Partial<AiSession>): Promise<AiSession | undefined> {
    const [updated] = await db.update(aiSessions).set(updates).where(eq(aiSessions.id, id)).returning();
    return updated;
  }
}
