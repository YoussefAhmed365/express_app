import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_12345";

const verifyToken = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            const error = new Error("Access denied. No token provided.");
            error.statusCode = 401;
            throw error;
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            error.statusCode = 401;
            error.message = "Invalid or expired token. Please log in again.";
        }
        next(error);
    }
};

const restrictTo = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            const error = new Error(
                `Access denied. Allowed roles: [${allowedRoles.join(", ")}].`
            );
            error.statusCode = 403;
            return next(error);
        }
        next();
    };
};

const adminOnly = restrictTo("admin");

export {
    verifyToken,
    restrictTo,
    adminOnly,
    JWT_SECRET,
};
