import { Request, Response } from "express";
import * as authService from "../services/auth.service";

type RegisterBody = {
  name: string;
  email: string;
  password: string;
  role: string;
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
      message: "Login berhasil",
      data: result,
    });
  } catch (err) {
    return res.status(400).json({
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
};
