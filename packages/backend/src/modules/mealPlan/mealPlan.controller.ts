import { type Request, type Response } from 'express';
import fs from 'fs';
import type { UserToken } from '../../middlewares/auth';
import MealPlan from './mealPlan.model';
import User from '../users/user.model';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class MealPlanController {
  getWeekRange = () => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = (day === 0 ? -6 : 1 - day);
    const monday = new Date(today.setDate(today.getDate() + diffToMonday));
    const sunday = new Date(monday.getTime());
    sunday.setDate(monday.getDate() + 6);
    return { start: monday, end: sunday };
  }

  generateMealPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findOne({ email: req.user?.email });

      if (!user) {
        res.status(400).json({ success: false, message: 'User not found' });
      }

      const content = `
        You are a meal planning assistant for the "MyFood" app, which helps users plan healthier meals based on their dietary preferences, nutritional goals, and available ingredients. Your task is to generate a 7-day meal plan for the user with breakfast, lunch, and dinner for each day. Each meal should include a recipe name, a brief description, and a list of ingredients. Ensure the meal plan aligns with the user's preferences, goals, and available ingredients as much as possible.

        **User Details:**
        - **Dietary Preferences:**
          - Diets: ${user!.preferences.diets.join(', ') || 'None'}
          - Allergies: ${user!.preferences.allergies.join(', ') || 'None'}
          - Favorite Foods: ${user!.preferences.favoriteFoods.join(', ') || 'None'}
        - **Nutritional Goals (per day):**
          - Calories: ${user!.goals.dailyCalories} kcal
          - Protein: ${user!.goals.dailyProtein} g
          - Carbs: ${user!.goals.dailyCarbs} g
          - Fat: ${user!.goals.dailyFat} g
          - Fiber: ${user!.goals.dailyFiber} g
        - **Available Ingredients:** ${user!.availableIngredients.join(', ') || 'None'}

        **Instructions:**
        1. Create a 7-day meal plan with three meals per day (breakfast, lunch, dinner).
        2. For each meal, provide:
           - Recipe name
           - Brief description (1-2 sentences)
           - List of ingredients (include quantities if possible)
        3. Ensure the recipes:
           - Follow the user's dietary preferences (e.g., vegetarian, low-carb).
           - Avoid the user's allergies.
           - Prioritize the user's favorite foods where possible.
           - Use the user's available ingredients as much as possible, but you can include additional ingredients if needed.
        4. Ensure the total nutritional content of each day's meals is as close as possible to the user's daily nutritional goals.
        5. The user is not looking to cook everyday so on the meal plan, cooking should not be done everyday and meals that are cooked can be repeated you can specify how many portions of the meal is to be cooked in the mealToCook with '(n portions)' wherew n is the number of portions/ how many times the user will eat the meal within the week and then repeat the meal within the week depending on the number of portions, make sure the total
          meal cooking time is as close as possible to how long the user has to cook weekly
      `;

      const thread = await openai.beta.threads.create();
      await openai.beta.threads.messages.create(
        thread.id,
        {
          role: "user",
          content
        }
      );
      let run = await openai.beta.threads.runs.createAndPoll(
        thread.id,
        {
          assistant_id: process.env.OPENAI_ASSISTANT_ID as string,
        }
      );

      if (run.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(
          run.thread_id
        );
        const response = JSON.parse(messages.data[0]!.content[0]!.text.value);
        const mealPlan = new MealPlan({
          user: user!._id,
          dailyPlans: response.dailyPlans,
          week: this.getWeekRange(),
          ingredientsNeeded: response.ingredientsNeeded,
        });

        await mealPlan.save();
        res.status(200).json({ success: true, message: 'Meal plan generated successfully', data: JSON.parse(messages.data[0]!.content[0]!.text.value) });
      } else {
        console.log(run.status);
        res.status(500).json({ success: false, message: 'Failed to generate meal plan', error: run.status });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Something went wrong', error });
    }
  }

  getMealPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findOne({ email: req.user?.email });
      if (!user) {
        res.status(400).json({ success: false, message: 'User not found' });
      }

      const mealPlan = await MealPlan.findOne({ user: user?._id, week: this.getWeekRange() })
      if (!mealPlan) {
        res.status(404).json({ success: false, message: 'Meal plan not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Meal plan retrieved successfully', data: mealPlan });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Something went wrong', error });
    }
  }

  getTodayMealPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findOne({ email: req.user?.email });
      if (!user) {
        res.status(400).json({ success: false, message: 'User not found' });
      }
      const mealPlan = await MealPlan.findOne({ user: user?._id, week: this.getWeekRange() })
      if (!mealPlan) {
        res.status(404).json({ success: false, message: 'Meal plan not found' });
        return;
      }
      const today = new Date();
      const day = today.toLocaleString('default', { weekday: 'long' });
      const todayMealPlan = mealPlan.dailyPlans.find((plan) => plan.day === day);
      res.status(200).json({ success: true, message: 'Today\'s meal plan retrieved successfully', data: todayMealPlan });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Something went wrong', error });
    }
  }

  getNeededIngredients = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findOne({ email: req.user?.email });
      if (!user) {
        res.status(400).json({ success: false, message: 'User not found' });
      }
      const mealPlan = await MealPlan.findOne({ user: user?._id, week: this.getWeekRange() })
      if (!mealPlan) {
        res.status(404).json({ success: false, message: 'Meal plan not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Needed ingredients retrieved successfully', data: mealPlan.ingredientsNeeded });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Something went wrong', error });
    }
  }


}

export default new MealPlanController();
