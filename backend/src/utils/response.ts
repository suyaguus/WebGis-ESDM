import { Response } from "express";

export const successResponse = <T>(
  res: Response,
  data: T,
  message = "Success",
) => {
  return res.json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res: Response, message = "Error", code = 400) => {
  return res.status(code).json({
    success: false,
    message,
  });
};
