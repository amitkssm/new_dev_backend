
const fs = require('fs')
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const secretKey = 'kms-ak-node';
const multer = require("multer");

//========================== Function for Bcrypt and Decrypt Password =================================//

exports.bcryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    console.log(hashedPassword)
    return hashedPassword;
}
exports.decryptPassword = async (getpassword, userpassword) => {
    const validPass = await bcrypt.compare(getpassword, userpassword)
    return validPass;
}

//====================================== Function For JWT ===============================================//

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized : Missing token' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden : Invalid token' });
        }

        req.user = user;
        next();
    });
};

//========================== Function For Upload Image & Documents ===================================//

// exports.upload = multer({

//     storage: multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, "uploads")
//         },
//         filename: function (req, file, cb) {
//             cb(null, Date.now() + file.originalname)
//         }
//     })
// }).single("file");

// // Multer configuration for file uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname);
//     }
//   });
//   const upload = multer({ storage });

exports.upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads"); // Store files in 'uploads' folder
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        }
    })
}).fields([
    { name: "profile_image", maxCount: 1 },
    { name: "cover_image", maxCount: 1 },
    { name: "partner_logo", maxCount: 1 },
    { name: "image", maxCount: 10 },
    { name: "icon", maxCount: 10 },
    { name: "area_images", maxCount: 10 },
    { name: "details_icon", maxCount: 10 },  // Capture all icons
    { name: "details_image", maxCount: 10 }  // Capture all images
]);




