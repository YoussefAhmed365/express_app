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

router.get("/", getAllBooks);
router.get("/:id", getBookById);

router.post("/", verifyToken, createBook);
router.put("/:id", verifyToken, updateBook);
router.patch("/:id", verifyToken, updateBook);

router.delete("/:id", verifyToken, adminOnly, deleteBook);

export default router;