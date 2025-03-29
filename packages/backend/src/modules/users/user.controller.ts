import User from './user.model';
import jwt from 'jsonwebtoken';
import { type Request, type Response } from 'express';


export default class UserController {
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

}
