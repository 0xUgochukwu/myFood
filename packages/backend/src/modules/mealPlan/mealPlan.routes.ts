
import express from 'express';
import MealPlanController from './mealPlan.controller';
import authenticate from '../../middlewares/auth';

const router = express.Router();

router.get('/', authenticate, MealPlanController.getMealPlan);
router.get('/today', authenticate, MealPlanController.getTodayMealPlan);
router.post('/generate', authenticate, MealPlanController.generateMealPlan);
router.get('/needed-ingredients', authenticate, MealPlanController.getNeededIngredients);

export default router;


