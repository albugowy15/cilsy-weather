import { type Request, type Response, type NextFunction } from "express";
import { errorRes } from "./http";
import logger from "./logger";

class AppError extends Error {
  message: string;
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.message = message;
    this.code = code;
  }
}

export { AppError };

export function appErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let errCode = 500;
  let errMessage = "Internal server error";
  if (err instanceof AppError) {
    errCode = err.code;
    errMessage = err.message;
  }
  logger.error(err.message);
  res.status(errCode).json(errorRes(errMessage));
}
