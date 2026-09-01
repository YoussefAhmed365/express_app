import Book from "../models/books.model.js";

const getAllBooks = async (req, res, next) => {
    try {
        const hasPagination = req.query.page || req.query.limit;

        if (!hasPagination) {
            const books = await Book.find().populate("author").sort({ createdAt: -1 });
            return res.status(200).json({
                status: true,
                total: books.length,
                data: books,
            });
        }

        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
        const skip = (page - 1) * limit;

        const [books, total] = await Promise.all([
            Book.find()
                .populate("author")
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Book.countDocuments(),
        ]);

        const totalPages = Math.ceil(total / limit) || 1;

        res.status(200).json({
            status: true,
            pagination: {
                total,
                page,
                limit,
                totalPages,
            },
            data: books,
        });
    } catch (error) {
        next(error);
    }
};

const getBookById = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id).populate("author");

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

const createBook = async (req, res, next) => {
    try {
        const newBook = await Book.create(req.body);
        const populatedBook = await Book.findById(newBook._id).populate("author");

        res.status(201).json({
            status: true,
            message: "Book created successfully.",
            data: populatedBook || newBook,
        });
    } catch (error) {
        next(error);
    }
};

const updateBook = async (req, res, next) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).populate("author");

        if (!updatedBook) {
            const error = new Error(`Book with ID ${req.params.id} not found.`);
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            status: true,
            message: "Book updated successfully.",
            data: updatedBook,
        });
    } catch (error) {
        next(error);
    }
};

const deleteBook = async (req, res, next) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);

        if (!deletedBook) {
            const error = new Error(`Book with ID ${req.params.id} not found.`);
            error.statusCode = 404;
            throw error;
        }

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