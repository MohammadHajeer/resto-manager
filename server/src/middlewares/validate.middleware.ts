import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

function validate(schema: z.ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsedData = JSON.parse(req.body.data || "{}");
    console.log("Validating request body:", parsedData);
    const result = schema.safeParse(parsedData);

    if (!result.success) {
      return next(result.error);
    }

    next();
  };
}

export { validate };

