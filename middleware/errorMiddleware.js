const errorMiddleware = (err, _req, res, _next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error.";

    // Handle Mongoose CastError (e.g., invalid ObjectId)
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid format for field '${err.path}': ${err.value}`;
    }

    // Handle Mongoose ValidationError
    if (err.name === "ValidationError") {
        statusCode = 400;
        const messages = Object.values(err.errors).map((val) => val.message);
        message = messages.join(", ");
    }

    // Handle Mongoose Duplicate Key Error (e.g. duplicate email)
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue || {})[0];
        message = `Duplicate value for field '${field}'. Please use another value.`;
    }

    // Handle JWT Errors
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Invalid or expired token. Please log in again.";
    }

    res.status(statusCode).json({
        status: false,
        message,
    });
};

export default errorMiddleware;