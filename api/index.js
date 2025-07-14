const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

// DB connection
require("../db/config");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// File access route
app.get("/file/uploads/:path", (req, res) => {
  const safePath = path.join(__dirname, "../uploads", req.params.path);
  fs.readFile(safePath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(404).send("File not found");
    }
    res.end(data);
  });
});

// Routes
const adminRoute = require("../admin/index");
const frontUserRoute = require("../frontUsers/index");

app.use("/admin", adminRoute);
app.use("/front_user", frontUserRoute);

// Export for Vercel
module.exports = serverless(app);
