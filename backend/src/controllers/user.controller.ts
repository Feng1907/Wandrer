import { Request, Response } from 'express';
import * as userService from '../services/user.service';
type Role = 'CUSTOMER' | 'ADMIN' | 'STAFF' | 'GUIDE';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page, limit, role, search } = req.query;
    const result = await userService.getUsers({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      role: role as Role | undefined,
      search: search as string | undefined,
    });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUserRole(String(req.params.id), req.body.role);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const toggleUserActive = async (req: Request, res: Response) => {
  try {
    const user = await userService.toggleUserActive(String(req.params.id));
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const createGuideProfile = async (req: Request, res: Response) => {
  try {
    const { bio, languages, experience } = req.body;
    const guide = await userService.createGuideProfile(String(req.params.id), bio, languages, experience);
    res.status(201).json(guide);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getGuides = async (_req: Request, res: Response) => {
  try {
    const guides = await userService.getGuides();
    res.json(guides);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
