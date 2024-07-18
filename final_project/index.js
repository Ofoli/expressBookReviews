const express = require("express");
const session = require("express-session");
const {
  authenticated: customer_routes,
  Token,
} = require("./router/auth_users.js");
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", async (req, res, next) => {
  const token = req.session.token;
  if (!token) return res.status(401).json({ status: false });

  try {
    const user = await Token.verify(token);
    req.user = user;
    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid or Expired token" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
