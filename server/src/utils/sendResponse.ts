import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: ApiResponse<T>,
) => {
  res.status(statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data,
    pagination: payload.pagination,
  });
};
