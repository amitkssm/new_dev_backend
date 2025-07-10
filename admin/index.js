const express = require("express");
const router = express.Router();
const adminController = require("./admin.contrroller");
const adminHandler = require("./admin.handler");
const multer = require('multer');

//users
router.post("/login", adminHandler.upload, adminController.login)
router.post("/updatePassword", adminHandler.upload, adminController.updatePassword)
router.post("/registration", adminController.Registration);
router.post("/UpdateUser", adminHandler.upload, adminController.UpdateUser);
router.post("/GetAllUsers", adminController.GetAllUsers);
router.post("/GetUserById", adminController.GetUserById);
router.post("/DeleteUser", adminController.DeleteUser);

// languages

router.post("/addLanguage", adminController.addLanguage);
router.post("/getLanguageById", adminController.getLanguageById);
router.post("/getLanguages", adminController.getLanguages);
router.post("/updateLanguage", adminController.updateLanguage);
router.post("/deleteLanguage", adminController.deleteLanguage);

//Topic
router.post("/addTopic", adminController.addTopic);
router.post("/getTopicsByLanguage", adminController.getTopicsByLanguage);
router.post("/getTopicsById", adminController.getTopicsById);
router.post("/updateTopic", adminController.updateTopic);
router.post("/deleteTopic", adminController.deleteTopic);

//Sub Topic
router.post("/addSubtopic", adminController.addSubtopic);
router.post("/getSubtopicsByTopic", adminController.getSubtopicsByTopic);
router.post("/updateSubtopic", adminController.updateSubtopic);
router.post("/updateSubtopic", adminController.updateSubtopic);
router.post("/deledeleteSubtopicteTopic", adminController.deleteSubtopic);




module.exports = router;