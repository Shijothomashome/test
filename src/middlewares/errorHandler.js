import mongoose from "mongoose";
import { ZodError } from "zod";

/**
 * Express error handler middleware
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";

    // Mongoose validation error
    if (err instanceof mongoose.Error.ValidationError) {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((error) => `${error.path}: Required`)
            .join(", ");
    }

    // Mongoose cast error (e.g., invalid ObjectId)
    else if (err instanceof mongoose.Error.CastError) {
        statusCode = 400;
        message = `${err.path}: Required`;
    }

    // MongoDB duplicate key error
    else if (isMongoDuplicateError(err)) {
        const field = Object.keys(err.keyValue)[0];
        statusCode = 400;
        message = `${field}: Already exists`;
    }

    // Zod validation error
    else if (err instanceof ZodError) {
        statusCode = 400;
        message = err.issues
            .map((issue) => {
                return `${issue.path.join('.')}: Required`;
            })
            .join(", ");
    }

    // Custom error with status and message
    else if (isErrorWithStatusAndMessage(err)) {
        statusCode = err.status;
        message = err.message;
    }

    console.log(err)
    console.error(`\x1b[31m${message}\x1b[0m`);
    if(message=="Internal Server Error")console.log(err)
    res.status(statusCode).json({
        success: false,
        message,
    });
};

// Type guard helpers
function isMongoDuplicateError(error) {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000 &&
        "keyValue" in error
    );
}

function isErrorWithStatusAndMessage(error) {
    return (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        "message" in error
    );
}

export default errorHandler;
