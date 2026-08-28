import express from "express";
import booksRoutes from "./routes/books.routes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/books", booksRoutes);

app.get("/", (_req, res) => {
    res.send("Server is ready");
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});