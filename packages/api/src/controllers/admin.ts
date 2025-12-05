import { Request, Response } from 'express';
import { prisma } from '../db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET } from '../middleware/auth';

export const adminLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    // For demo purposes, if no admin exists, create one with 'admin'/'123456'
    const adminCount = await prisma.admin.count();
    if (adminCount === 0 && username === 'admin' && password === '123456') {
       const hashedPassword = await bcrypt.hash(password, 10);
       await prisma.admin.create({ data: { username, password: hashedPassword } });
    }

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin || !await bcrypt.compare(password, admin.password)) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: admin.id, username: admin.username, role: 'admin' } });
  } catch (error) {
    res.status(500).json({ message: '服务器内部错误' });
  }
};

export const getActivities = async (req: Request, res: Response) => {
  try {
    const activities = await prisma.activity.findMany();
    // Parse config string to JSON
    const result = activities.map(a => ({ ...a, config: JSON.parse(a.config) }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: '获取活动列表失败' });
  }
};

export const getActivityById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const activity = await prisma.activity.findUnique({ where: { id: Number(id) } });
    if (!activity) return res.status(404).json({ message: '活动未找到' });
    res.json({ ...activity, config: JSON.parse(activity.config) });
  } catch (error) {
    res.status(500).json({ message: '获取活动失败' });
  }
};

export const createActivity = async (req: Request, res: Response) => {
  const { name, config } = req.body;
  try {
    const activity = await prisma.activity.create({
      data: {
        name,
        config: JSON.stringify(config)
      }
    });
    res.json({ ...activity, config: JSON.parse(activity.config) });
  } catch (error) {
    res.status(500).json({ message: '创建活动失败' });
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, config } = req.body;
  try {
    const activity = await prisma.activity.update({
      where: { id: Number(id) },
      data: {
        name,
        config: JSON.stringify(config)
      }
    });
    res.json({ ...activity, config: JSON.parse(activity.config) });
  } catch (error) {
    res.status(500).json({ message: '更新活动失败' });
  }
};

export const uploadActivity = async (req: Request, res: Response) => {
    // This endpoint was requested: POST /activities/:id/upload
    // Assuming it updates the config from a file or something similar, 
    // or just uploads a file associated with activity.
    // Requirement says "Upload Activity". I'll assume it means uploading a JSON config file.
    
    const { id } = req.params;
    if (!req.file) {
        return res.status(400).json({ message: '未上传文件' });
    }

    try {
        const fileContent = req.file.buffer.toString('utf-8');
        let config;
        try {
            config = JSON.parse(fileContent);
        } catch (e) {
            return res.status(400).json({ message: '无效的 JSON 文件' });
        }

        const activity = await prisma.activity.update({
            where: { id: Number(id) },
            data: { config: JSON.stringify(config) }
        });
        
        res.json({ ...activity, config: JSON.parse(activity.config) });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading activity' });
    }
}
