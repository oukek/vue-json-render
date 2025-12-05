import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const authenticate = (role?: 'admin' | 'user') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: '未提供 Token' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      if (role && decoded.role !== role) {
        return res.status(403).json({ message: '权限不足' });
      }

      (req as any).user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: '无效的 Token' });
    }
  };
};
