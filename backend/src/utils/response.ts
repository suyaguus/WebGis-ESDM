import { Response } from "express";

export const successResponse = <T>(res: Response, data: T, message: string) => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res: Response, message: string, code = 400) => {
  return res.status(code).json({
    success: false,
    message,
  });
};
