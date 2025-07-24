import mongoose from "mongoose";
import z from 'zod'
const errorHandler = (err, req, res, next) => {
  let statusCode = err.status || 500;
  let message = err.message || "Internal Server Error";
console.log(err)
  // Handle Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => `${error.path} is required.`)
      .join(", ");
  }

  // Handle Mongoose cast errors (e.g., invalid ObjectId format)
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle MongoDB duplicate key errors (e.g., unique constraint violations)
  else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for '${field}': ${err.keyValue[field]}`;
  }

  // Handle Zod validation errors
  else if (err instanceof z.ZodError) {
    statusCode = 400;
    message = err.errors
      .map((e) => `${e.path.join(" > ")}: ${e.message}`)
      .join(", ");
  }

  // Log the error in red
  console.error(`\x1b[31m${message}\x1b[0m`);

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler
