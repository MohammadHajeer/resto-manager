import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: ApiResponse<T>
) => {
  res.status(statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data,
  });
};