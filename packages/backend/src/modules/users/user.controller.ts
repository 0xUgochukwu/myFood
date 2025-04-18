import User from './user.model';
import jwt from 'jsonwebtoken';
import { type Request, type Response } from 'express';
import type { UserToken } from '../../middlewares/auth';

class UserController {
  googleSignOn = async (req: Request, res: Response) => {
    const user = req.body;

    try {
      const existingUser = await User.findOne({ email: user.email });
      if (existingUser) {
        const token = jwt.sign(user, process.env.JWT_SECRET as string, {
          expiresIn: '24h',
        });
        res.json({
          success: true,
          message: 'User logged in successfully',
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
          success: true,
          message: 'User created successfully',
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
      res.status(500).json({ success: false, message: 'Something went wrong' });
    }
  }


  completeOnboarding = async (req: Request, res: Response): Promise<void> => {
    const user: UserToken | undefined = req.user;
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
      res.json({ success: true, message: 'Onboarding completed' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Something went wrong' });
    }
  }


  getAvailableIngredients = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findOne({ email: req.user?.email });
      if (!user) {
        res.status(400).json({ message: 'User not found' });
      }
      res.json({
        success: true,
        message: 'Available ingredients retrieved successfully',
        data: user?.availableIngredients,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Something went wrong' });
    }
  }

  addAvailableIngredient = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findOne({ email: req.user?.email });
      if (!user) {
        res.status(400).json({ message: 'User not found' });
      }
      const { ingredient } = req.body;
      user!.availableIngredients.push(ingredient);
      await user!.save();
      res.json({
        success: true,
        message: 'Available ingredients added successfully',
        availableIngredients: user?.availableIngredients,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Something went wrong' });
    }
  }

  checkOnboardingStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findOne({ email: req.user?.email });
      if (!user) {
        res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'User onboarding status retrieved successfully',
        data: {
          onboardingCompleted: user.onboardingCompleted || false,
          user: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            picture: user.picture,
          }
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Something went wrong' });
    }
  }

  getUserGoals = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findOne({ email: req.user?.email });
      if (!user) {
        res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'User goals retrieved successfully',
        data: user.goals
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Something went wrong' });
    }
  }

  removeAvailableIngredient = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findOne({ email: req.user?.email });
      if (!user) {
        res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
        return;
      }
      
      const { ingredient } = req.body;
      const index = user.availableIngredients.indexOf(ingredient);
      
      if (index > -1) {
        user.availableIngredients.splice(index, 1);
        await user.save();
      }
      
      res.json({
        success: true,
        message: 'Available ingredient removed successfully',
        data: user.availableIngredients
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Something went wrong' });
    }
  }
}

export default new UserController();
