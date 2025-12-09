import { Request, Response } from 'express';
import { prisma } from '../db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET } from '../middleware/auth';

export const userLogin = async (req: Request, res: Response) => {
  const { username, password, serverId } = req.body;
  try {
    if (!serverId) {
       return res.status(400).json({ message: '请选择服务器' });
    }

    // Auto-create user for demo if not exists (e.g. user/123456)
    const userCount = await prisma.user.count();
    if (userCount === 0 && username === 'user' && password === '123456') {
       const hashedPassword = await bcrypt.hash(password, 10);
       await prisma.user.create({ data: { username, password: hashedPassword } });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: 'user' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, username: user.username, role: 'user' } });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误' });
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: '用户未找到' });
    res.json({ 
      id: user.id, 
      username: user.username, 
      role: 'user',
      level: user.level,
      experience: user.experience
    });
  } catch (error) {
    res.status(500).json({ message: '获取用户信息失败' });
  }
};

export const getUserActivityConfig = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const activity = await prisma.activity.findUnique({ where: { id: Number(id) } });
      if (!activity) return res.status(404).json({ message: '活动未找到' });
      // Only return name and config as per requirement? Or maybe just config?
      // Requirement: "Activity configuration query function (display name field in configuration after entering activity ID)"
      // It says "display name field in configuration". This is slightly ambiguous.
      // Does it mean "display the 'name' field FROM the configuration"?
      // Or "display the activity's name AND the configuration"?
      // Requirement text: "Activity data model contains fields: id (primary key), config (JSON type), name (string)"
      // Requirement text: "Activity configuration query function (display name field in configuration after entering activity ID)"
      // It likely means getting the Activity object which has `name` and `config`.
      
      res.json({ name: activity.name, config: JSON.parse(activity.config) });
    } catch (error) {
      res.status(500).json({ message: '获取活动失败' });
    }
};
