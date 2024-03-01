const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./src/Routes/index");
const cookiParser = require("cookie-parser");
const app = express();
const path = require("path");

const dirname = path.resolve();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookiParser());
app.use("/api", routes);

// app.use(express.static(path.join(dirname, "/client/dist")));
// // console.log(path.join(dirname, "/client/build/.env"));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(dirname, "client", "dist", "index.html"));
// });

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

module.exports = app;
