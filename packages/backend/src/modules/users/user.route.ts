import express from 'express';
import UserController from './user.controller';
import authenticate from '../../middlewares/auth';

const router = express.Router();

router.post('/google-auth', UserController.googleSignOn);
router.post('/complete-onboarding', authenticate, UserController.completeOnboarding);

export default router;


