import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import prisma from "../config/prisma";
import { USER_SELECT } from "../constants/user.select";
import { saveAuditLog } from "../utils/audit";

type RegisterBody = {
  name?: string;
  email: string;
  password: string;
  phone?: string;
  role?: "super_admin" | "admin_perusahaan" | "kepala_instansi" | "supervisor";
  companyName?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyType?: string;
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
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ??
    req.socket.remoteAddress ??
    "unknown";
  try {
    const result = await authService.loginUser(
      req.body.email,
      req.body.password,
    );

    await saveAuditLog({
      userId: result.user.id,
      userName: result.user.name,
      action: "LOGIN",
      target: "Sistem",
      ip,
    });

    return res.json({
      token: result.token,
      expiresIn: 86400,
      user: result.user,
    });
  } catch (err) {
    await saveAuditLog({
      userName: req.body.email,
      action: "LOGIN_FAILED",
      target: "Sistem",
      ip,
    });
    return res.status(401).json({
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ??
    req.socket.remoteAddress ??
    "unknown";
  if (user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true },
    });
    await saveAuditLog({
      userId: user.id,
      userName: dbUser?.name ?? user.id,
      action: "LOGOUT",
      target: "Sistem",
      ip,
    });
  }
  return res.json({
    success: true,
    message: "Logout berhasil",
  });
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
