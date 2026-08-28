const errorMiddleware = (err, _req, res, _next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: false,
        message: err.message || "Internal Server Error.",
    });
};

export default errorMiddleware;