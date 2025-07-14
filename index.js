
const mongoose = require("mongoose");
const express = require("express");
const fs = require('fs')
const jwt = require('jsonwebtoken');
const multer = require("multer");
var bcrypt = require('bcryptjs');
var randomstring = require('randomstring');
const bodyParser = require('body-parser');
var moment = require('moment');
const path = require('path');
const https = require('https');
const serverless = require('serverless-http');



const ObjectId = require('mongoose').Types.ObjectId;
const cors = require("cors");


// Connect to MongoDB
require("./db/config");


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/file/uploads/:path', (req, res) => {
    console.log("DSDA")
    const safePath = path.join(__dirname, 'uploads', req.params.path);
    fs.readFile(safePath, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(404).send("File not found");
        }
        res.end(data);
    });
});


// api/hello.js
module.exports = (req, res) => {
  res.status(200).json({ message: "Hello from Vercel!" });
};


// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const adminRoute = require("./admin/index")
const frontUserRoute = require("./frontUsers/index")

/************************ API Rout ******************* */
app.use("/admin",adminRoute);

app.use("/front_user",frontUserRoute);



// app.listen((3007), () => {
//     console.log("app is running on port 3007")
// })

// Export handler
module.exports.handler = serverless(app);















