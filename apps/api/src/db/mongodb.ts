import mongoose from "mongoose";

type MongoDB = typeof mongoose;
async function connectMongoDB(mongoUrl: string) {
  try {
    await mongoose.connect(mongoUrl);
  } catch (error) {
    console.error("cant connect to mongodb:", error);
    throw new Error("can't connect to mongodb");
  }
}

export { connectMongoDB, type MongoDB };
