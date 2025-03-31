import User from './user.model';
import jwt from 'jsonwebtoken';
import { type Request, type Response } from 'express';
import type { UserToken } from '../../middlewares/auth';


class UserController {
  async googleSignOn(req: Request, res: Response) {
    const user = req.body;

    try {
      const existingUser = await User.findOne({ email: user.email });
      if (existingUser) {
        const token = jwt.sign(user, process.env.JWT_SECRET as string, {
          expiresIn: '30d',
        });
        res.json({
          user: {
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            picture: existingUser.picture,
          }, token
        });
      } else {
        const newUser = new User(user);
        await newUser.save();
        const token = jwt.sign(user, process.env.JWT_SECRET as string, {
          expiresIn: '30d',
        });
        res.json({
          user: {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            picture: newUser.picture,
          }, token
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }


  async completeOnboarding(req: Request, res: Response): Promise<void> {
    const user: UserToken | undefined = req.user;
    console.log(req.user);
    const { preferences, goals, availableIngredients } = req.body;

    try {
      const existingUser = await User.findOne({ email: user?.email });
      if (!existingUser) {
        res.status(404).json({ message: 'User not found' });
      }
      existingUser!.preferences = preferences;
      existingUser!.goals = goals;
      existingUser!.availableIngredients = availableIngredients;
      existingUser!.onboardingCompleted = true;
      await existingUser!.save();
      res.json({ message: 'Onboarding completed' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

}

export default new UserController();
