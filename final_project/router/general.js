const express = require("express");
let books = require("./booksdb.js");
const { users, isValid, hashPassword } = require("./auth_users.js");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ status: false, message: "username and password required" });
  }
  const usernameExist = isValid(username);
  if (usernameExist) {
    return res
      .status(400)
      .json({ status: false, message: "User already exist" });
  }

  const hashedPassword = hashPassword(password);
  const user = { username, password: hashedPassword, id: users.length + 1 };
  users.push(user);

  return res
    .status(201)
    .json({ status: true, user: { username, id: user.id } });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const availableBooks = Object.values(books);
  return res.json({ status: true, books: availableBooks });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ status: false, message: "Not found" });
  }
  return res.json({ status: true, book });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const authorBooks = Object.values(books).filter(
    (book) => book.author.toLocaleLowerCase() === author.toLocaleLowerCase()
  );
  return res.json({ status: true, books: authorBooks });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const titleBooks = Object.values(books).filter((book) =>
    book.title.toLocaleLowerCase().includes(title.toLocaleLowerCase())
  );
  return res.json({ status: true, books: titleBooks });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ status: false, message: "Not found" });
  }
  return res.json({ status: true, reviews: book.reviews });
});

module.exports.general = public_users;
