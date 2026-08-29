import express from "express";
import {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
} from "../controllers/books.controller.js";
import { verifyToken, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllBooks);
router.get("/:id", getBookById);

// Protected routes (Requires valid JWT)
router.post("/", verifyToken, createBook);
router.put("/:id", verifyToken, updateBook);
router.patch("/:id", verifyToken, updateBook);

// Admin-only route (Requires valid JWT with admin role)
router.delete("/:id", verifyToken, adminOnly, deleteBook);

export default router;