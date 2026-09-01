import express from "express";
import connectDB from "./config/db.js";
import booksRoutes from "./routes/books.routes.js";
import authorsRoutes from "./routes/authors.routes.js";
import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/books", booksRoutes);
app.use("/authors", authorsRoutes);

app.get("/", (_req, res) => {
    res.send("Server is ready");
});

app.use(errorMiddleware);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on port: ${PORT}`);
    });
});