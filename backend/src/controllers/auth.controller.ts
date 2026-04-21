import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { Role } from "@prisma/client";
import prisma from "../config/prisma";
import { USER_SELECT } from "../constants/user.select";

type RegisterBody = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

type LoginBody = {
  email: string;
  password: string;
};

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
) => {
  try {
    const user = await authService.registerUser(req.body);

    return res.json({
      message: "Register berhasil",
      data: user,
    });
  } catch (err) {
    return res.status(400).json({
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const result = await authService.loginUser(
      req.body.email,
      req.body.password,
    );

    return res.json({
      token: result.token,
      expiresIn: 86400,
      user: result.user,
    });
  } catch (err) {
    return res.status(400).json({
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: USER_SELECT,
    });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    return res.json(user);
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
