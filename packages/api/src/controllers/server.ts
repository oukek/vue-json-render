import { Request, Response } from 'express';
import { prisma } from '../db';

export const getServers = async (req: Request, res: Response) => {
  const { activityId } = req.query;
  try {
    const where = activityId ? { activityId: Number(activityId) } : {};
    const servers = await prisma.server.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        activity: {
          select: {
            name: true
          }
        }
      }
    });
    res.json(servers);
  } catch (error) {
    res.status(500).json({ message: '获取服务器列表失败' });
  }
};

export const createServer = async (req: Request, res: Response) => {
  const { name, status, activityId } = req.body;
  if (!activityId) {
    return res.status(400).json({ message: '请选择活动' });
  }
  try {
    const server = await prisma.server.create({
      data: {
        name,
        status: status || 'active',
        activityId: Number(activityId)
      }
    });
    res.json(server);
  } catch (error) {
    res.status(500).json({ message: '创建服务器失败' });
  }
};

export const updateServer = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, status } = req.body;
  try {
    const server = await prisma.server.update({
      where: { id: Number(id) },
      data: {
        name,
        status
      }
    });
    res.json(server);
  } catch (error) {
    res.status(500).json({ message: '更新服务器失败' });
  }
};

export const deleteServer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.server.delete({
      where: { id: Number(id) }
    });
    res.json({ message: '服务器删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除服务器失败' });
  }
};
