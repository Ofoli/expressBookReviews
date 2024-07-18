const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const books = require("./booksdb.js");
const regd_users = express.Router();

const JWT_SECRET = "b10a8db164e0754105b7a99be72e3fe5";
const users = [];

module.exports.Token = {
  generate: (data) => jwt.sign(data, JWT_SECRET, { expiresIn: "1h" }),
  verify: async (token) => await jwt.verify(token, JWT_SECRET),
};

module.exports.hashPassword = (password) =>
  crypto.createHash("md5").update(password).digest("hex");

const isValid = (username) => {
  //returns boolean
  return !!users.find((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ status: false, message: "username and password required" });
  }

  const user = users.find(
    (user) =>
      user.username === username &&
      user.password === this.hashPassword(password)
  );
  if (!user) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid username or password" });
  }

  const token = this.Token.generate({ id: user.id, username });
  req.session.token = token;

  return res.json({ status: true, user: { id: user.id, username } });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
