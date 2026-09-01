import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import { JWT_SECRET } from "../middleware/authMiddleware.js";

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            const error = new Error("Please provide name, email, and password.");
            error.statusCode = 400;
            throw error;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("User with this email already exists.");
            error.statusCode = 400;
            throw error;
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            status: true,
            message: "User registered successfully.",
            token,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error("Please provide email and password.");
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("Invalid email or password.");
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            const error = new Error("Invalid email or password.");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            status: true,
            message: "Login successful.",
            token,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

export {
    register,
    login,
};
