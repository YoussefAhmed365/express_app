import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Book name is required."],
            trim: true,
            minlength: [2, "Book name must be at least 2 characters long."],
        },
        price: {
            type: Number,
            min: [0, "Price cannot be negative."],
            default: 0,
        },
        description: {
            type: String,
            trim: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Author",
        },
    },
    {
        timestamps: true,
    }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
