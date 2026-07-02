import { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

export type AuthRole = "admin" | "restaurant_owner" | "customer";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  (req as any).auth = session;

  next();
};

export const requireRole = (...allowedRoles: AuthRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const userRole = session.user.role as AuthRole | undefined;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    (req as any).auth = session;

    next();
  };
};
