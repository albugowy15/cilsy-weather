import mongoose from "mongoose";
import logger from "../util/logger";
import { AppError } from "../util/error";

type MongoDB = typeof mongoose;
async function connectMongoDB(mongoUrl: string) {
  try {
    const db = await mongoose.connect(mongoUrl);
    logger.info("connected to database");
    return db;
  } catch (error) {
    logger.error("cant connect to mongodb:", error);
    throw new AppError(500, "can't connect to mongodb");
  }
}

export { connectMongoDB, type MongoDB };
