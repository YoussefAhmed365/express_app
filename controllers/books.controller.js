import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const booksFilePath = path.join(__dirname, "../json/books.json");

// Read books from JSON file
const readBooks = async () => {
    try {
        const data = await fs.readFile(booksFilePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        if (error.code === "ENOENT") {
            return [];
        }
        throw error;
    }
};

// Write books to JSON file
const writeBooks = async (books) => {
    await fs.writeFile(booksFilePath, JSON.stringify(books, null, 4), "utf-8");
};

// GET /books:
const getAllBooks = async (_req, res, next) => {
    try {
        const books = await readBooks();
        res.status(200).json({
            status: true,
            data: books,
        });
    } catch (error) {
        next(error);
    }
};

// GET /books/:id:
const getBookById = async (req, res, next) => {
    try {
        const bookId = parseInt(req.params.id, 10);
        const books = await readBooks();

        const book = books.find((b) => b.id === bookId);
        if (!book) {
            const error = new Error(`Book with ID ${req.params.id} not found.`);
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            status: true,
            data: book,
        });
    } catch (error) {
        next(error);
    }
};

// POST /books:
const createBook = async (req, res, next) => {
    try {
        const { name, ...otherProps } = req.body;

        if (!name || typeof name !== "string" || name.trim() === "") {
            const error = new Error("Invalid book data. 'name' is required and must be a non-empty string.");
            error.statusCode = 400;
            throw error;
        }

        const books = await readBooks();

        const maxId = books.reduce((max, b) => (b.id > max ? b.id : max), 0);
        const newBook = {
            id: maxId + 1,
            name: name.trim(),
            ...otherProps,
        };

        books.push(newBook);
        await writeBooks(books);

        res.status(201).json({
            status: true,
            message: "Book created successfully.",
            data: newBook,
        });
    } catch (error) {
        next(error);
    }
};

// PUT /books/:id:
const updateBook = async (req, res, next) => {
    try {
        const bookId = parseInt(req.params.id, 10);
        const { name, ...otherProps } = req.body;

        if (!name || typeof name !== "string" || name.trim() === "") {
            const error = new Error("Invalid book data. 'name' is required and must be a non-empty string.");
            error.statusCode = 400;
            throw error;
        }

        const books = await readBooks();
        const bookIndex = books.findIndex((b) => b.id === bookId);

        if (bookIndex === -1) {
            const error = new Error(`Book with ID ${req.params.id} not found.`);
            error.statusCode = 404;
            throw error;
        }

        books[bookIndex] = {
            ...books[bookIndex],
            name: name.trim(),
            ...otherProps,
            id: bookId,
        };

        await writeBooks(books);

        res.status(200).json({
            status: true,
            message: "Book updated successfully.",
            data: books[bookIndex],
        });
    } catch (error) {
        next(error);
    }
};

// DELETE /books/:id:
const deleteBook = async (req, res, next) => {
    try {
        const bookId = parseInt(req.params.id, 10);
        const books = await readBooks();

        const bookIndex = books.findIndex((b) => b.id === bookId);

        if (bookIndex === -1) {
            const error = new Error(`Book with ID ${req.params.id} not found.`);
            error.statusCode = 404;
            throw error;
        }

        const [deletedBook] = books.splice(bookIndex, 1);
        await writeBooks(books);

        res.status(200).json({
            status: true,
            message: "Book deleted successfully.",
            data: deletedBook,
        });
    } catch (error) {
        next(error);
    }
};

export {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
};