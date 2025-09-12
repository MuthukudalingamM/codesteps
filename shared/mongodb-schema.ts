import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// User Schema
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  skillLevel: { type: String, required: true, default: 'beginner' },
  currentStreak: { type: Number, required: true, default: 0 },
  totalLessons: { type: Number, required: true, default: 0 },
  completedLessons: { type: Number, required: true, default: 0 },
  challengesSolved: { type: Number, required: true, default: 0 },
  isEmailVerified: { type: Boolean, required: true, default: false },
  isPhoneVerified: { type: Boolean, required: true, default: false },
  emailVerificationToken: { type: String },
  phoneVerificationCode: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Session Schema
const sessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Lesson Schema
const lessonSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  codeExample: { type: String },
  difficulty: { type: String, required: true, default: 'beginner' },
  category: { type: String, required: true },
  order: { type: Number, required: true },
  isCompleted: { type: Boolean, required: true, default: false },
});

// Challenge Schema
const challengeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, required: true },
  category: { type: String, required: true },
  testCases: { type: Schema.Types.Mixed },
  solution: { type: String },
  hints: { type: Schema.Types.Mixed },
});

// User Progress Schema
const userProgressSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson' },
  challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge' },
  status: { type: String, required: true, default: 'not_started' },
  completedAt: { type: Date },
  score: { type: Number },
});

// Community Post Schema
const communityPostSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  likes: { type: Number, required: true, default: 0 },
  replies: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// AI Session Schema
const aiSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messages: { type: Schema.Types.Mixed },
  context: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Create Models
export const User = mongoose.model('User', userSchema);
export const Session = mongoose.model('Session', sessionSchema);
export const Lesson = mongoose.model('Lesson', lessonSchema);
export const Challenge = mongoose.model('Challenge', challengeSchema);
export const UserProgress = mongoose.model('UserProgress', userProgressSchema);
export const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);
export const AiSession = mongoose.model('AiSession', aiSessionSchema);

// Zod validation schemas (keeping the same validation logic)
export const insertUserSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  skillLevel: z.string().default('beginner'),
  currentStreak: z.number().default(0),
  totalLessons: z.number().default(0),
  completedLessons: z.number().default(0),
  challengesSolved: z.number().default(0),
  isEmailVerified: z.boolean().default(false),
  isPhoneVerified: z.boolean().default(false),
  emailVerificationToken: z.string().optional(),
  phoneVerificationCode: z.string().optional(),
});

export const insertLessonSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.string().min(1),
  codeExample: z.string().optional(),
  difficulty: z.string().default('beginner'),
  category: z.string().min(1),
  order: z.number(),
  isCompleted: z.boolean().default(false),
});

export const insertChallengeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.string().min(1),
  category: z.string().min(1),
  testCases: z.any().optional(),
  solution: z.string().optional(),
  hints: z.any().optional(),
});

export const insertUserProgressSchema = z.object({
  userId: z.string(),
  lessonId: z.string().optional(),
  challengeId: z.string().optional(),
  status: z.string().default('not_started'),
  completedAt: z.date().optional(),
  score: z.number().optional(),
});

export const insertCommunityPostSchema = z.object({
  userId: z.string(),
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1),
  likes: z.number().default(0),
  replies: z.number().default(0),
});

export const insertAiSessionSchema = z.object({
  userId: z.string(),
  messages: z.any().optional(),
  context: z.string().optional(),
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserDoc = Document & {
  _id: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
  skillLevel: string;
  currentStreak: number;
  totalLessons: number;
  completedLessons: number;
  challengesSolved: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  emailVerificationToken?: string;
  phoneVerificationCode?: string;
  createdAt: Date;
};

export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type LessonDoc = Document & {
  _id: string;
  title: string;
  description: string;
  content: string;
  codeExample?: string;
  difficulty: string;
  category: string;
  order: number;
  isCompleted: boolean;
};

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type ChallengeDoc = Document & {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  testCases?: any;
  solution?: string;
  hints?: any;
};

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgressDoc = Document & {
  _id: string;
  userId: string;
  lessonId?: string;
  challengeId?: string;
  status: string;
  completedAt?: Date;
  score?: number;
};

export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityPostDoc = Document & {
  _id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  replies: number;
  createdAt: Date;
};

export type InsertAiSession = z.infer<typeof insertAiSessionSchema>;
export type AiSessionDoc = Document & {
  _id: string;
  userId: string;
  messages?: any;
  context?: string;
  createdAt: Date;
};