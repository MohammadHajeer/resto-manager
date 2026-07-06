import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

function validate(schema: z.ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const bodyToValidate =
        typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body;

      const result = schema.safeParse(bodyToValidate);

      if (!result.success) {
        return next(result.error);
      }

      req.body = result.data;

      next();
    } catch {
      return next(new Error("Invalid JSON data"));
    }
  };
}

export { validate };