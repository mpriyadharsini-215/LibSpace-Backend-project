import express from "express";
import bookController from "../controller/bookController.js";
import { verifyToken } from "../middlewares/verify_token.js";

const bookRouter = express.Router();

bookRouter.post("/addbook", verifyToken, bookController.addBook);
bookRouter.get("/getBooks", verifyToken, bookController.getAllBooks);
bookRouter.get("/:bookId", verifyToken, bookController.getBookById);
bookRouter.put("/:bookId", verifyToken, bookController.updateBook);
bookRouter.delete("/deleteBook/:bookId", verifyToken, bookController.deleteBook);

export default bookRouter;