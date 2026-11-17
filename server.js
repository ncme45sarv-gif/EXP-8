
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to read JSON data
app.use(express.json());

// Sample book collection
let books = [
    {
        id: 1,
        title: "The Alchemist",
        author: "Paulo Coelho",
        year: 1988
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        year: 2018
    },
    {
        id: 3,
        title: "Harry Potter",
        author: "J.K. Rowling",
        year: 1997
    }
];

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to the Book Collection API!");
});

// 1. GET - Display all books
app.get("/books", (req, res) => {
    res.status(200).json(books);
});

// 2. GET - Display a single book
app.get("/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// 3. POST - Add a new book
app.post("/books", (req, res) => {
    const { title, author, year } = req.body;

    if (
        typeof title !== "string" || !title.trim() ||
        typeof author !== "string" || !author.trim() ||
        !Number.isInteger(year) || year < 1
    ) {
        return res.status(400).json({
            message: "Please provide a valid title, author and year"
        });
    }

    const newBook = {
        id: books.length
            ? Math.max(...books.map(b => b.id)) + 1
            : 1,
        title: title.trim(),
        author: author.trim(),
        year
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// 4. PUT - Update a book
app.put("/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, year } = req.body;

    if (
        typeof title !== "string" || !title.trim() ||
        typeof author !== "string" || !author.trim() ||
        !Number.isInteger(year) || year < 1
    ) {
        return res.status(400).json({
            message: "Please provide valid book details"
        });
    }

    book.title = title.trim();
    book.author = author.trim();
    book.year = year;

    res.status(200).json({
        message: "Book updated successfully",
        book
    });
});

// 5. DELETE - Remove a book
app.delete("/books/:id", (req, res) => {
    const id = Number(req.params.id);

    const bookExists = books.some(b => b.id === id);

    if (!bookExists) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books = books.filter(b => b.id !== id);

    res.status(200).json({
        message: "Book deleted successfully"
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
