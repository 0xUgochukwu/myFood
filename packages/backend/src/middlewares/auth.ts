import jwt from 'jsonwebtoken';
import { type NextFunction, type Request, type Response } from 'express';
import User from '../modules/users/user.model';

interface UserToken {
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
}

export default function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }
  try {
    const verifiedUser: UserToken = <UserToken>(jwt.verify(token, process.env.JWT_SECRET as string));
    req.user = verifiedUser;

    const user = User.findOne({ email: verifiedUser.email });
    if (!user) {
      return res.status(401).json({ message: 'Access Denied' });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token' });
  }
}
