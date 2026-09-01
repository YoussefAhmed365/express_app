import Author from "../models/authors.model.js";

const getAllAuthors = async (_req, res, next) => {
    try {
        const authors = await Author.find();
        res.status(200).json({
            status: true,
            count: authors.length,
            data: authors,
        });
    } catch (error) {
        next(error);
    }
};

const getAuthorById = async (req, res, next) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            const error = new Error(`Author with ID ${req.params.id} not found.`);
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            status: true,
            data: author,
        });
    } catch (error) {
        next(error);
    }
};

const createAuthor = async (req, res, next) => {
    try {
        const newAuthor = await Author.create(req.body);
        res.status(201).json({
            status: true,
            message: "Author created successfully.",
            data: newAuthor,
        });
    } catch (error) {
        next(error);
    }
};

export {
    getAllAuthors,
    getAuthorById,
    createAuthor,
};
