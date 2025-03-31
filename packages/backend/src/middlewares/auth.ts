import jwt from 'jsonwebtoken';
import { type NextFunction, type Request, type Response } from 'express';
import User from '../modules/users/user.model';

export interface UserToken {
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
}

export default async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: 'Access Denied 1' });
  }
  try {
    const verifiedUser: UserToken = <UserToken>(jwt.verify(token, process.env.JWT_SECRET as string));
    req.user = verifiedUser;

    const user = await User.findOne({ email: verifiedUser.email });
    if (!user) {
      res.status(401).json({ message: 'Access Denied' });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token' });
  }
}
