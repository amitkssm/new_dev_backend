
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



const ObjectId = require('mongoose').Types.ObjectId;
const cors = require("cors");



require("./db/config");



const app = express();
app.use(express.json());
app.use(cors());

// Body parser middleware
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

app.listen((3007), () => {
    console.log("app is running on port 3007")
})


// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const adminRoute = require("./admin/index")
const frontUserRoute = require("./frontUsers/index")

/************************ API Rout ******************* */
app.use("/admin",adminRoute);

app.use("/front_user",frontUserRoute);
















