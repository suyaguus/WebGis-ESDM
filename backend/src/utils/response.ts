import { Response } from "express";
import { JwtPayload } from "../types/auth";

export const successResponse = (
  res: Response,
  data: unknown,
  message = "Success",
  user?: JwtPayload,
) => {
  try {
    return res.json({
      success: true,
      message,
      metadata: {
        status: 200,
        actor: user
          ? {
              id: user.id,
              name: user.id,
              role: user.role,
            }
          : null,
      },
      data,
    });
  } catch (err) {
    console.error("[successResponse] Serialization error:", err);
    return res.status(500).json({
      success: false,
      message: "Error serializing response",
      metadata: { status: 500 },
    });
  }
};

export const errorResponse = (res: Response, message = "Error", code = 400) => {
  return res.status(code).json({
    success: false,
    message,
    metadata: {
      status: code,
    },
  });
};

export const buildDeleteResponse = (id: string, userId: string) => {
  return {
    id,
    deletedBy: userId,
  };
};
