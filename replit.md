# CodeSteps - AI Programming Learning App

## Overview

CodeSteps is a comprehensive AI-powered programming language learning platform that provides interactive lessons, real-time code editing, error solving assistance, and community features. The application uses a modern full-stack architecture with React/TypeScript frontend, Node.js/Express backend, and PostgreSQL database with Drizzle ORM. The core value proposition is adaptive AI tutoring that personalizes the learning experience for each user.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for build tooling
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Code Editor**: Custom code editor component (Monaco Editor integration ready)

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: Express sessions with PostgreSQL store
- **Error Handling**: Centralized error handling middleware
- **Development**: tsx for TypeScript execution in development

### Database Design
- **Users Table**: Stores user profiles, skill levels, progress tracking
- **Lessons Table**: Structured learning content with difficulty levels
- **Challenges Table**: Coding exercises with test cases and solutions
- **User Progress Table**: Tracks completion status and scores
- **Community Posts Table**: User-generated content and discussions
- **AI Sessions Table**: Chat history and context for AI interactions

### AI Integration
- **Provider**: OpenAI GPT-5 for intelligent tutoring and code assistance
- **Features**: 
  - Contextual programming help and explanations
  - Code error detection and solution suggestions
  - Adaptive lesson recommendations based on user progress
  - Real-time chat support during coding exercises

### Page Structure
The application follows a dashboard layout with the following main pages:
- **Dashboard**: Progress overview and quick access to features
- **AI Tutor**: Interactive lessons with AI-driven explanations
- **Code Editor**: Real-time coding environment with AI assistance
- **Error Solver**: Detailed error analysis and debugging help
- **Challenges**: Programming exercises with difficulty progression
- **Community**: User forums and collaborative features
- **Profile**: User analytics and achievement tracking
- **Settings**: Customization and preference management

### Development Workflow
- **Development**: `npm run dev` starts both frontend and backend in development mode
- **Build**: Vite bundles frontend, esbuild bundles backend
- **Database**: Drizzle Kit handles schema migrations and database operations
- **Type Safety**: Shared schema types between frontend and backend

## External Dependencies

### Core Infrastructure
- **Database**: PostgreSQL (configured for Neon serverless)
- **AI Service**: OpenAI API for GPT-5 language model
- **Session Store**: PostgreSQL-based session storage

### Frontend Libraries
- **UI Framework**: Radix UI primitives for accessible components
- **State Management**: TanStack Query for server state synchronization
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React icon library
- **Carousel**: Embla Carousel for interactive components

### Development Tools
- **Build Tools**: Vite for frontend bundling, esbuild for backend
- **Type Checking**: TypeScript with strict configuration
- **Styling**: Tailwind CSS with PostCSS processing
- **Development Environment**: Replit integration with runtime error overlay

### Authentication & Security
- **Session Management**: connect-pg-simple for PostgreSQL session store
- **Validation**: Zod schemas for runtime type validation
- **Environment Variables**: DATABASE_URL and OPENAI_API_KEY required

### Deployment Requirements
- PostgreSQL database with connection string
- OpenAI API key for AI functionality
- Node.js runtime environment supporting ES modules