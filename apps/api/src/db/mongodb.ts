import mongoose from "mongoose";

type MongoDB = typeof mongoose;
async function connectMongoDB(mongoUrl: string) {
  try {
    const db = await mongoose.connect(mongoUrl);
    return db;
  } catch (error) {
    console.error("cant connect to mongodb:", error);
    throw new Error("can't connect to mongodb");
  }
}

export { connectMongoDB, type MongoDB };
