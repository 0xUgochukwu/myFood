import express from 'express';
import UserController from './user.controller';

const router = express.Router();

router.post('/google-auth', new UserController().googleSignOn);

export default router;


