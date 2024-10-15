import { Request, Response, NextFunction } from "express";
import { z } from "zod";

function zodValidation<T extends z.ZodTypeAny>(schema: T) {
  return function (req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const validationResult = schema.safeParse(body);
    const formatted = validationResult.error?.format();
    if (!validationResult.success) {
      const response = {
        success: false,
        error: formatted,
      };
      res.status(400).json(response);
    } else {
      next();
    }
  };
}

export { zodValidation };
