import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import prisma from "../config/prisma";
import { USER_SELECT } from "../constants/user.select";
import { saveAuditLog } from "../utils/audit";
import { sendOtpEmail } from "../utils/mailer";
import bcrypt from "bcrypt";
import crypto from "crypto";

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

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ message: "Email wajib diisi." });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    // Always respond 200 to prevent user enumeration
    if (!user) {
      return res.json({ message: "Jika email terdaftar, kode OTP telah dikirim." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

    // Invalidate previous unused OTPs for this email
    await prisma.passwordResetOtp.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    await prisma.passwordResetOtp.create({
      data: { email, otp, expiresAt },
    });

    await sendOtpEmail(email, otp);

    return res.json({ message: "Jika email terdaftar, kode OTP telah dikirim." });
  } catch (err) {
    console.error("[forgotPassword]", err);
    return res.status(500).json({ message: "Gagal mengirim OTP. Coba lagi." });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body as { email?: string; otp?: string };
  if (!email || !otp) return res.status(400).json({ message: "Email dan OTP wajib diisi." });

  try {
    const record = await prisma.passwordResetOtp.findFirst({
      where: { email, otp, used: false },
      orderBy: { createdAt: "desc" },
    });

    if (!record) return res.status(400).json({ message: "OTP tidak valid." });
    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP sudah kadaluarsa. Minta ulang kode baru." });
    }

    return res.json({ valid: true, message: "OTP valid." });
  } catch (err) {
    return res.status(500).json({ message: "Gagal memverifikasi OTP." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body as {
    email?: string;
    otp?: string;
    newPassword?: string;
  };

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP, dan password baru wajib diisi." });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Password minimal 8 karakter." });
  }

  try {
    const record = await prisma.passwordResetOtp.findFirst({
      where: { email, otp, used: false },
      orderBy: { createdAt: "desc" },
    });

    if (!record) return res.status(400).json({ message: "OTP tidak valid." });
    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP sudah kadaluarsa. Minta ulang kode baru." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.user.update({ where: { email }, data: { password: hashed } }),
      prisma.passwordResetOtp.update({ where: { id: record.id }, data: { used: true } }),
    ]);

    return res.json({ message: "Password berhasil direset. Silakan login." });
  } catch (err) {
    console.error("[resetPassword]", err);
    return res.status(500).json({ message: "Gagal mereset password." });
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
