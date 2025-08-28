import mongoose from "mongoose";
import clc from "cli-color";
import dotenv from "dotenv";
import productModel from "../models/productModel.js";
dotenv.config(); 


const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_CONNECTION_STRING;
    if (!uri) throw new Error("MONGODB_URI not found");

    await mongoose.connect(uri);
 
    console.log(clc.green("✅ Database connected successfully"));
  } catch (error) {
    console.error(clc.red("❌ Database connection failed:"), clc.yellow(error.message));
    process.exit(1);
  }
};

export default connectDB;
