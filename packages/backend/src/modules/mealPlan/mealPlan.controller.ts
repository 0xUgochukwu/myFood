import { type Request, type Response } from 'express';
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
        return;
      }

      const weekRange = this.getWeekRange();
      
      // Check for existing meal plan
      const existingPlan = await MealPlan.findOne({
        user: user._id,
        'week.start': { 
          $lte: weekRange.end 
        },
        'week.end': { 
          $gte: weekRange.start 
        }
      }).exec();

      if (existingPlan) {
        res.status(200).json({ 
          success: true, 
          message: 'Meal plan already exists for this week',
          data: existingPlan
        });
        return;
      }

      const content = `
      You are a meal planning assistant for the "MyFood" app. Your task is to generate a 7-day meal plan with breakfast, lunch, and dinner for each day.

      **TOP PRIORITY: NUTRITIONAL ACCURACY**
      
      **User Details:**
      - **Dietary Preferences:**
        - Diets: ${user!.preferences.diets.join(', ') || 'None'}
        - Allergies: ${user!.preferences.allergies.join(', ') || 'None'}
        - Favorite Foods: ${user!.preferences.favoriteFoods.join(', ') || 'None'}
      - **Available Ingredients:** ${user!.availableIngredients.join(', ') || 'None'}

      **BATCH COOKING REQUIREMENT:**
      - The user should NOT cook every day - this is very important
      - For each week, designate only 2-3 specific days as "cooking days"
      - On cooking days, prepare multiple portions of meals that will be eaten throughout the week
      - Clearly mark each cooking day with "COOKING DAY" and specify exactly which meals are being prepared
      - For each prepared meal, specify the number of portions in parentheses, e.g., "Grilled Chicken (3 portions)"
      - When a meal is repeated on subsequent days, note that it's a leftover portion from the cooking day
      - The meal plan should show clear meal repetition across the week, with minimal daily cooking

      **PRE-CALCULATED MEAL NUTRITIONAL TARGETS:**
      Use these EXACT nutritional targets for each meal. Do not deviate from these values.
      
      BREAKFAST (30% of daily nutrition):
      - Calories: ${Math.round(user!.goals.dailyCalories * 0.3)} kcal
      - Protein: ${Math.round(user!.goals.dailyProtein * 0.3)} g
      - Carbs: ${Math.round(user!.goals.dailyCarbs * 0.3)} g
      - Fat: ${Math.round(user!.goals.dailyFat * 0.3)} g
      - Fiber: ${Math.round(user!.goals.dailyFiber * 0.3)} g
      
      LUNCH (35% of daily nutrition):
      - Calories: ${Math.round(user!.goals.dailyCalories * 0.35)} kcal
      - Protein: ${Math.round(user!.goals.dailyProtein * 0.35)} g
      - Carbs: ${Math.round(user!.goals.dailyCarbs * 0.35)} g
      - Fat: ${Math.round(user!.goals.dailyFat * 0.35)} g
      - Fiber: ${Math.round(user!.goals.dailyFiber * 0.35)} g
      
      DINNER (35% of daily nutrition):
      - Calories: ${Math.round(user!.goals.dailyCalories * 0.35)} kcal
      - Protein: ${Math.round(user!.goals.dailyProtein * 0.35)} g
      - Carbs: ${Math.round(user!.goals.dailyCarbs * 0.35)} g
      - Fat: ${Math.round(user!.goals.dailyFat * 0.35)} g
      - Fiber: ${Math.round(user!.goals.dailyFiber * 0.35)} g
      
      DAILY TOTALS (for reference):
      - Calories: ${user!.goals.dailyCalories} kcal
      - Protein: ${user!.goals.dailyProtein} g
      - Carbs: ${user!.goals.dailyCarbs} g
      - Fat: ${user!.goals.dailyFat} g
      - Fiber: ${user!.goals.dailyFiber} g
      
      **CRITICAL INSTRUCTIONS:**
      1. Create EACH meal to EXACTLY match the pre-calculated nutritional values above
      2. Do NOT attempt to recalculate or redistribute the nutritional values
      3. EVERY breakfast must match the breakfast values, EVERY lunch must match the lunch values, and EVERY dinner must match the dinner values
      4. Each meal's nutrition can vary by MAXIMUM ±5% from the target values
      5. IMPLEMENT BATCH COOKING: Include only 2-3 cooking days per week, with meals prepared in multiple portions and repeated on other days unless the user has so much time to cook like more than 10 hours a week
      
      **Meal Plan Format:**
      1. For each meal, provide:
         - Recipe name
         - Brief description (1-2 sentences)
         - List of ingredients with precise quantities
         - Exact nutritional breakdown matching the targets above
      
      **Cooking Efficiency:**
      - The user won't cook every day
      - For meals that are cooked, indicate portions with "(n portions)" where n is the number of times it will be eaten
      - Repeat meals according to the number of portions prepared
      
      **VERIFICATION:**
      Before finalizing each meal, verify that its nutritional values are within ±5% of the specified targets. If any value is outside this range, adjust the ingredients to meet the targets.
      
      IMPORTANT: Using the pre-calculated values above is NON-NEGOTIABLE. Do not attempt to recalculate or change these values.
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

        const messageContent = messages.data[0]?.content[0];
        if (!messageContent || messageContent.type !== 'text') {
          throw new Error('Invalid response from OpenAI');
        }

        const response = JSON.parse(messageContent.text.value);
        const mealPlan = new MealPlan({
          user: user._id,
          dailyPlans: response.dailyPlans,
          week: weekRange,
          ingredientsNeeded: response.ingredientsNeeded,
        });

        await mealPlan.save();
        res.status(200).json({ 
          success: true, 
          message: 'Meal plan generated successfully', 
          data: response 
        });
      } else {
        console.error('OpenAI run failed:', run.status);
        res.status(500).json({ 
          success: false, 
          message: 'Failed to generate meal plan', 
          error: run.status 
        });
      }
    } catch (error) {
      console.error('Error generating meal plan:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to generate meal plan',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  getMealPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findOne({ email: req.user?.email });
      if (!user) {
        res.status(400).json({ success: false, message: 'User not found' });
        return;
      }

      const weekRange = this.getWeekRange();

      const mealPlan = await MealPlan.findOne({
        user: user._id,
        'week.start': { 
          $lte: weekRange.end 
        },
        'week.end': { 
          $gte: weekRange.start 
        }
      }).exec();

      if (!mealPlan) {
        console.log('No meal plan found for the current week');
        res.status(404).json({
          success: false,
          message: 'No meal plan found for the current week. Please generate a new meal plan.'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Meal plan retrieved successfully',
        data: mealPlan
      });
    } catch (error) {
      console.error('Error in getMealPlan:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve meal plan',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  getTodayMealPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findOne({ email: req.user?.email });
      if (!user) {
        res.status(400).json({ success: false, message: 'User not found' });
        return;
      }

      const weekRange = this.getWeekRange();
      const today = new Date();
      const mealPlan = await MealPlan.findOne({
        user: user._id,
        'week.start': { 
          $lte: weekRange.end 
        },
        'week.end': { 
          $gte: weekRange.start 
        }
      }).exec();

      if (!mealPlan) {
        console.log('No meal plan found for the current week');
        res.status(404).json({
          success: false,
          message: 'No meal plan found for this week. Please generate a new meal plan.'
        });
        return;
      }

      const day = today.toLocaleString('default', { weekday: 'long' });
      const todayMealPlan = mealPlan.dailyPlans.find((plan) => plan.day === day);

      if (!todayMealPlan) {
        console.log('No meal plan found for today:', day);
        res.status(404).json({
          success: false,
          message: `No meal plan found for ${day}. Please generate a new meal plan.`
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Today\'s meal plan retrieved successfully',
        data: todayMealPlan
      });
    } catch (error) {
      console.error('Error in getTodayMealPlan:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve today\'s meal plan',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  getNeededIngredients = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findOne({ email: req.user?.email });
      if (!user) {
        res.status(400).json({ success: false, message: 'User not found' });
      }
      const weekRange = this.getWeekRange();
      const mealPlan = await MealPlan.findOne({ 
        user: user?._id,
        'week.start': { 
          $lte: weekRange.end 
        },
        'week.end': { 
          $gte: weekRange.start 
        }
      });
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
