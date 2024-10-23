import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../util/error";

function zodValidation<T extends z.ZodTypeAny>(schema: T) {
  return function (req: Request, _res: Response, next: NextFunction) {
    const body = req.body;
    const validationResult = schema.safeParse(body);
    if (!validationResult.success) {
      const errorMessage = validationResult.error?.errors[0].message;
      throw new AppError(400, errorMessage || "invalid request body");
    }
    next();
  };
}

export { zodValidation };
