const errorMiddleware = (err, _req, res, _next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error.";

    res.status(statusCode).json({
        status: false,
        message,
    });
};

export default errorMiddleware;