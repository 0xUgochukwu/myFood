import { describe, it, expect, beforeAll, afterAll, beforeEach, mock, afterEach } from 'bun:test';
import UserController from '../../../../src/modules/users/user.controller';
import User from '../../../../src/modules/users/user.model';
import { setupTestDB, teardownTestDB, clearDatabase, createMockUser } from '../../../setup';
import mongoose from 'mongoose';

// Mock the User model methods
mock.module('../../../../src/modules/users/user.model', () => {
  return {
    default: {
      findOne: mock(() => ({
        save: mock(() => Promise.resolve())
      })),
      create: mock(() => Promise.resolve(createMockUser()))
    }
  };
});

describe('UserController', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearDatabase();
    mock.restore(); // Reset mocks before each test
  });

  afterEach(() => {
    mock.restore(); // Cleanup mocks after each test
  });

  describe('googleSignOn', () => {
    it('should sign in an existing user and return a token', async () => {
      // Mock user
      const mockUser = createMockUser();
      const findOneMock = mock(User.findOne).mockResolvedValueOnce(mockUser);
      const req = { body: { email: 'test@example.com' } };
      const res = {
        json: mock(data => data)
      };

      await UserController.googleSignOn(req as any, res as any);

      expect(findOneMock).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.token).toBeDefined();
    });

    it('should create a new user when the user does not exist', async () => {
      // Mock user doesn't exist
      const findOneMock = mock(User.findOne).mockResolvedValueOnce(null);
      const saveMock = mock(() => Promise.resolve());
      
      // Mock User model constructor
      mock(User).mockImplementation(() => ({
        save: saveMock,
        firstName: 'Test',
        lastName: 'User',
        email: 'new@example.com',
        picture: 'https://example.com/pic.jpg'
      }));

      const req = { body: { email: 'new@example.com' } };
      const res = {
        json: mock(data => data)
      };

      await UserController.googleSignOn(req as any, res as any);

      expect(findOneMock).toHaveBeenCalledWith({ email: 'new@example.com' });
      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.token).toBeDefined();
      expect(response.message).toBe('User created successfully');
    });
  });

  describe('getAvailableIngredients', () => {
    it('should return available ingredients for the user', async () => {
      // Mock user
      const mockUser = createMockUser();
      const findOneMock = mock(User.findOne).mockResolvedValueOnce(mockUser);
      
      const req = { user: { email: 'test@example.com' } };
      const res = {
        json: mock(data => data)
      };

      await UserController.getAvailableIngredients(req as any, res as any);

      expect(findOneMock).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockUser.availableIngredients);
    });

    it('should return 400 when user is not found', async () => {
      // Mock user not found
      const findOneMock = mock(User.findOne).mockResolvedValueOnce(null);
      
      const req = { user: { email: 'notfound@example.com' } };
      const res = {
        status: mock(function(code) { 
          this.statusCode = code;
          return this;
        }),
        json: mock(function(data) {
          this.data = data;
          return this;
        })
      };

      await UserController.getAvailableIngredients(req as any, res as any);

      expect(findOneMock).toHaveBeenCalledWith({ email: 'notfound@example.com' });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].message).toBe('User not found');
    });
  });

  describe('addAvailableIngredient', () => {
    it('should add an ingredient to the user\'s available ingredients', async () => {
      // Mock user
      const mockUser = createMockUser();
      mockUser.availableIngredients = ['Rice'];
      const mockPush = mock();
      mockUser.availableIngredients.push = mockPush;

      const findOneMock = mock(User.findOne).mockResolvedValueOnce(mockUser);
      const saveMock = mock(() => Promise.resolve());
      mockUser.save = saveMock;
      
      const req = { 
        user: { email: 'test@example.com' },
        body: { ingredient: 'Tomato' }
      };
      
      const res = {
        json: mock(data => data)
      };

      await UserController.addAvailableIngredient(req as any, res as any);

      expect(findOneMock).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockPush).toHaveBeenCalledWith('Tomato');
      expect(saveMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
    });
  });

  describe('removeAvailableIngredient', () => {
    it('should remove an ingredient from the user\'s available ingredients', async () => {
      // Mock user
      const mockUser = createMockUser();
      mockUser.availableIngredients = ['Rice', 'Beans', 'Tomato'];
      const mockSplice = mock();
      mockUser.availableIngredients.splice = mockSplice;

      const findOneMock = mock(User.findOne).mockResolvedValueOnce(mockUser);
      const saveMock = mock(() => Promise.resolve());
      mockUser.save = saveMock;
      
      const req = { 
        user: { email: 'test@example.com' },
        body: { ingredient: 'Beans' }
      };
      
      const res = {
        json: mock(data => data)
      };

      await UserController.removeAvailableIngredient(req as any, res as any);

      expect(findOneMock).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockSplice).toHaveBeenCalled();
      expect(saveMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
    });
  });

  describe('getUserGoals', () => {
    it('should return the user\'s nutrition goals', async () => {
      // Mock user
      const mockUser = createMockUser();
      const findOneMock = mock(User.findOne).mockResolvedValueOnce(mockUser);
      
      const req = { user: { email: 'test@example.com' } };
      const res = {
        json: mock(data => data)
      };

      await UserController.getUserGoals(req as any, res as any);

      expect(findOneMock).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockUser.goals);
    });
  });
}); 