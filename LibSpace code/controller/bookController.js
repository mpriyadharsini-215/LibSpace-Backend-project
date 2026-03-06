import Book from "../models/book.model.js";

const bookController = {
  addBook: async (req, res) => {
    const { url, title, author } = req.body;
    const userId = req.user.id;

    if (!url || !title || !author) {
      return res.status(400).json({ success: false, msg: "All fields are required" });
    }

    try {
      const exists = await Book.findOne({ title });
      if (exists) {
        return res.status(409).json({ success: false, msg: "Book already exists" });
      }

      const newBook = new Book({ url, user: userId, title, author });
      await newBook.save();

      res.status(201).json({ success: true, msg: "Book added successfully", book: newBook });
    } catch (error) {
      res.status(500).json({ success: false, err: error.message });
    }
  },

  getAllBooks: async (req, res) => {
    try {
      const books = await Book.find({ user: req.user.id });
      res.json({ success: true, books });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getBookById: async (req, res) => {
    try {
      const book = await Book.findOne({ _id: req.params.bookId, user: req.user.id });
      if (!book) return res.status(404).json({ success: false, msg: "Book not found" });
      res.json({ success: true, book });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateBook: async (req, res) => {
    try {
      const updatedBook = await Book.findOneAndUpdate(
        { _id: req.params.bookId, user: req.user.id },
        req.body,
        { new: true }
      );
      if (!updatedBook) return res.status(404).json({ success: false, msg: "Book not found" });
      res.json({ success: true, book: updatedBook });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteBook: async (req, res) => {
    try {
      const deletedBook = await Book.findOneAndDelete({ _id: req.params.bookId, user: req.user.id });
      if (!deletedBook) return res.status(404).json({ success: false, msg: "Book not found" });
      res.json({ success: true, msg: "Book deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default bookController;