
import express from 'express';
import MealPlanController from './mealPlan.controller';
import authenticate from '../../middlewares/auth';

const router = express.Router();

router.post('/generate', authenticate, MealPlanController.generateMealPlan);

export default router;


