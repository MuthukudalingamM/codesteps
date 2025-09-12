import mongoose from 'mongoose';

// MongoDB connection string - can be provided via environment variable or use local MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codesteps';

// Connection options
const connectionOptions = {
  bufferCommands: false,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Connect to MongoDB
export async function connectToMongoDB(): Promise<void> {
  try {
    if (mongoose.connection.readyState === 0) {
      console.log('🔌 Connecting to MongoDB...');
      await mongoose.connect(MONGODB_URI, connectionOptions);
      console.log('✅ Connected to MongoDB successfully');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// Disconnect from MongoDB
export async function disconnectFromMongoDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
    throw error;
  }
}

// Get connection status
export function getMongoDBStatus(): string {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
}

// Export mongoose for direct access if needed
export { mongoose };