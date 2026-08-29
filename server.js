import express from "express";
import mongoose from "mongoose";
import booksRoutes from "./routes/books.routes.js";
import authorsRoutes from "./routes/authors.routes.js";
import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookstore_db";

app.use(express.json());

// Authentication routes (supporting POST /register, POST /login directly and /auth/*)
app.use("/", authRoutes);
app.use("/auth", authRoutes);
app.use("/users", authRoutes);

// Resource routes
app.use("/books", booksRoutes);
app.use("/authors", authorsRoutes);

app.get("/", (_req, res) => {
    res.send("Server is ready");
});

app.use(errorMiddleware);

// Connect to MongoDB and start server
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB successfully.");
        app.listen(PORT, () => {
            console.log(`Server started on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    });