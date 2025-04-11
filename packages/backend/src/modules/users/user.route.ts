import express from 'express';
import UserController from './user.controller';
import authenticate from '../../middlewares/auth';

const router = express.Router();


router.post('/google-auth', UserController.googleSignOn);
router.post('/complete-onboarding', authenticate, UserController.completeOnboarding);
router.get('/available-ingredients', authenticate, UserController.getAvailableIngredients);
router.post('/available-ingredients', authenticate, UserController.addAvailableIngredient);
router.delete('/available-ingredients', authenticate, UserController.removeAvailableIngredient);
router.get('/onboarding-status', authenticate, UserController.checkOnboardingStatus);
router.get('/goals', authenticate, UserController.getUserGoals);

export default router;


