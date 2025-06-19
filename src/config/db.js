import mongoose from "mongoose";
import clc from "cli-color";
import dotenv from "dotenv";
dotenv.config(); 


const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI not found");

    await mongoose.connect(uri);
    console.log(clc.green("✅ Database connected successfully"));
  } catch (error) {
    console.error(clc.red("❌ Database connection failed:"), clc.yellow(error.message));
    process.exit(1);
  }
};

export default connectDB;
