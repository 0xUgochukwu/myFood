import { describe, it, expect, beforeAll, afterAll, beforeEach, mock, afterEach } from 'bun:test';
import MealPlanController from '../../../../src/modules/mealPlan/mealPlan.controller';
import MealPlan from '../../../../src/modules/mealPlan/mealPlan.model';
import User from '../../../../src/modules/users/user.model';
import { setupTestDB, teardownTestDB, clearDatabase, createMockUser } from '../../../setup';
import mongoose from 'mongoose';

// Mock OpenAI
mock.module('openai', () => {
  return {
    default: class MockOpenAI {
      beta = {
        threads: {
          create: mock(() => Promise.resolve({ id: 'thread-123' })),
          messages: {
            create: mock(() => Promise.resolve({})),
            list: mock(() => Promise.resolve({
              data: [{
                content: [{
                  type: 'text',
                  text: { value: JSON.stringify({
                    dailyPlans: [
                      {
                        day: 'Monday',
                        meals: [
                          {
                            mealTime: 'breakfast',
                            recipe: {
                              name: 'Oatmeal with Berries',
                              description: 'A hearty breakfast',
                              nutrition: {
                                calories: 300,
                                protein: 10,
                                carbs: 50,
                                fat: 5
                              },
                              ingredients: ['Oats', 'Berries', 'Milk'],
                              instructions: ['Step 1', 'Step 2']
                            }
                          }
                        ],
                        cooking: {
                          isCookingDay: true,
                          mealToCook: 'Oatmeal with Berries',
                          cookingInstructions: 'Cook this.'
                        }
                      }
                    ],
                    ingredientsNeeded: ['Oats', 'Berries', 'Milk']
                  }) }
                }]
              }]
            })
          },
          runs: {
            createAndPoll: mock(() => Promise.resolve({ status: 'completed', thread_id: 'thread-123' }))
          }
        }
      }
    }
  };
});

describe('MealPlanController', () => {
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

  describe('getWeekRange', () => {
    it('should return the correct week range', () => {
      const controller = new MealPlanController();
      const weekRange = controller.getWeekRange();
      
      expect(weekRange).toHaveProperty('start');
      expect(weekRange).toHaveProperty('end');
      expect(weekRange.start).toBeInstanceOf(Date);
      expect(weekRange.end).toBeInstanceOf(Date);
      
      // Ensure end date is 6 days after start date
      const diffTime = Math.abs(weekRange.end.getTime() - weekRange.start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(6);
    });
  });

  describe('getMealPlan', () => {
    it('should return the meal plan for the current week', async () => {
      // Mock user and meal plan
      const mockUser = { _id: 'user123', ...createMockUser() };
      const mockMealPlan = {
        user: mockUser._id,
        dailyPlans: [{ day: 'Monday' }],
        week: { start: new Date(), end: new Date() }
      };
      
      // Setup mocks
      const findOneMock = mock(User.findOne).mockResolvedValue(mockUser);
      const findMealPlanMock = mock(MealPlan.findOne).mockReturnValue({
        exec: mock(() => Promise.resolve(mockMealPlan))
      });
      
      const req = { user: { email: 'test@example.com' } };
      const res = {
        status: mock(code => res),
        json: mock(data => data)
      };

      await MealPlanController.prototype.getMealPlan(req as any, res as any);

      expect(findOneMock).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(findMealPlanMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockMealPlan);
    });

    it('should return 404 when no meal plan exists for the current week', async () => {
      // Mock user but no meal plan
      const mockUser = { _id: 'user123', ...createMockUser() };
      
      // Setup mocks
      const findOneMock = mock(User.findOne).mockResolvedValue(mockUser);
      const findMealPlanMock = mock(MealPlan.findOne).mockReturnValue({
        exec: mock(() => Promise.resolve(null))
      });
      
      const req = { user: { email: 'test@example.com' } };
      const res = {
        status: mock(code => {
          res.statusCode = code;
          return res;
        }),
        json: mock(data => {
          res.data = data;
          return res;
        })
      };

      await MealPlanController.prototype.getMealPlan(req as any, res as any);

      expect(findOneMock).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(findMealPlanMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalled();
      expect(res.data.success).toBe(false);
    });
  });

  describe('getTodayMealPlan', () => {
    it('should return the meal plan for today', async () => {
      // Get today's day name
      const today = new Date().toLocaleString('default', { weekday: 'long' });
      
      // Mock user and meal plan
      const mockUser = { _id: 'user123', ...createMockUser() };
      const mockMealPlan = {
        user: mockUser._id,
        dailyPlans: [
          { day: today, meals: [], cooking: { isCookingDay: true } }
        ],
        week: { start: new Date(), end: new Date() }
      };
      
      // Setup mocks
      const findOneMock = mock(User.findOne).mockResolvedValue(mockUser);
      const findMealPlanMock = mock(MealPlan.findOne).mockReturnValue({
        exec: mock(() => Promise.resolve(mockMealPlan))
      });
      
      const req = { user: { email: 'test@example.com' } };
      const res = {
        status: mock(code => res),
        json: mock(data => data)
      };

      await MealPlanController.prototype.getTodayMealPlan(req as any, res as any);

      expect(findOneMock).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(findMealPlanMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockMealPlan.dailyPlans[0]);
    });
  });

  describe('generateMealPlan', () => {
    it('should generate a new meal plan when none exists', async () => {
      // Mock user
      const mockUser = { 
        _id: 'user123', 
        ...createMockUser(),
        preferences: {
          diets: ['Vegetarian'],
          allergies: [],
          favoriteFoods: ['Rice']
        },
        goals: {
          dailyCalories: 2000,
          dailyProtein: 100,
          dailyCarbs: 250,
          dailyFat: 70,
          dailyFiber: 30
        },
        availableIngredients: ['Rice', 'Beans']
      };
      
      // Setup mocks
      const findUserMock = mock(User.findOne).mockResolvedValue(mockUser);
      const findMealPlanMock = mock(MealPlan.findOne).mockReturnValue({
        exec: mock(() => Promise.resolve(null)) // No existing meal plan
      });
      
      // Mock meal plan creation
      const saveMock = mock(() => Promise.resolve());
      mock(MealPlan).mockImplementation(() => ({
        save: saveMock,
        user: mockUser._id,
        dailyPlans: [],
        week: { start: new Date(), end: new Date() },
        ingredientsNeeded: []
      }));
      
      const req = { user: { email: 'test@example.com' } };
      const res = {
        status: mock(code => res),
        json: mock(data => data)
      };

      await MealPlanController.prototype.generateMealPlan(req as any, res as any);

      expect(findUserMock).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(findMealPlanMock).toHaveBeenCalled();
      expect(saveMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.message).toBe('Meal plan generated successfully');
    });
  });
}); 