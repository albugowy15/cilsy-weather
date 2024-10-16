import mongoose from "mongoose";
import logger from "../util/logger";
import { AppError } from "../util/error";

async function connectMongoDB(mongoUrl: string) {
  try {
    await mongoose.connect(mongoUrl);
    logger.info("connected to database");
  } catch (error) {
    logger.error("cant connect to mongodb:", error);
    throw new AppError(500, "can't connect to mongodb");
  }
}

export { connectMongoDB };
