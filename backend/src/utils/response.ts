import { Response } from "express";

export const successResponse = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    metadata: {
      status: statusCode,
    },
    data,
  });
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
