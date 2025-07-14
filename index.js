const mongoose = require("mongoose");
const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const bodyParser = require("body-parser");
const moment = require("moment");
const path = require("path");
const https = require("https");
const serverless = require("serverless-http");
const cors = require("cors");

require("./db/config");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/file/uploads/:path", (req, res) => {
    const safePath = path.join(__dirname, "uploads", req.params.path);
    fs.readFile(safePath, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(404).send("File not found");
        }
        res.end(data);
    });
});

// Serve uploads statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const adminRoute = require("./admin/index");
const frontUserRoute = require("./frontUsers/index");

app.use("/admin", adminRoute);
app.use("/front_user", frontUserRoute);

// ✅ This is the correct way for Vercel Serverless
module.exports = app;
module.exports.handler = serverless(app);
