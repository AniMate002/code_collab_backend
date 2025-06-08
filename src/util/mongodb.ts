import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) throw new Error("MONGO_URI is not defined");
    const connection = await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected: ", connection.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
