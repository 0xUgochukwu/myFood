import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let mongoServer: MongoMemoryServer;

// Setup before all tests
export const setupTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
  
  // Mock JWT token verification
  process.env.JWT_SECRET = 'test-secret-key';
};

// Teardown after all tests
export const teardownTestDB = async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
};

// Clear all collections between tests
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    if (collection) {
      await collection.deleteMany({});
    }
  }
};

// Create a mock user for testing
export const createMockUser = () => {
  return {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    picture: 'https://example.com/pic.jpg',
    preferences: {
      diets: ['Vegetarian'],
      allergies: ['Nuts'],
      favoriteFoods: ['Rice']
    },
    goals: {
      dailyCalories: 2000,
      dailyProtein: 100,
      dailyCarbs: 200,
      dailyFat: 60,
      dailyFiber: 30
    },
    availableIngredients: ['Rice', 'Beans'],
    onboardingCompleted: true
  };
};

// Mock request and response objects
export const mockReq = (overrides = {}) => {
  return {
    user: { email: 'test@example.com' },
    body: {},
    params: {},
    ...overrides
  };
};

export const mockRes = () => {
  const res: any = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

// Mock function helper
export function fn<T extends (...args: any[]) => any>(implementation?: T): jest.Mock<ReturnType<T>, Parameters<T>> {
  return implementation as any || ((() => {}) as any);
}

// Define jest types for TypeScript
declare global {
  namespace jest {
    interface Mock<T = any, Y extends any[] = any[]> {
      (...args: Y): T;
      mockReturnValue: (val: T) => Mock<T, Y>;
    }
  }
} 