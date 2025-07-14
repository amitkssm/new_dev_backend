const fs = require('fs')
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const multer = require('multer');

const secretKey = 'kms-ak-node';
const handler = require('./admin.handler')

const { Registration, Language, Topic, Subtopic, Detail } = require("../schema/schema")



// Protected route using the verifyToken middleware /////////////////////////////
exports.protected = (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
};

/*************************** Upload Documents API for Query ********************** */
exports.uploadDocuments = (req, res) => {

    res.status(200).json({
        error: false,
        code: 200,
        message: "File Upload Successfully",
        file: req.file.filename
    })
};

/*************************** Get Documents API for Query ************************* */
exports.file = (req, res) => {
    fs.readFile("uploads/" + req.params.path, (err, data) => {
        console.log(err)
        res.end(data)
    })
};

/*************************** Login API for Users in KMS ************************** */
exports.login = async (req, res) => {
    console.log("/login")

    try {
        let email = req.body.email ? req.body.email : ""
        let password1 = req.body.password ? req.body.password : ""
        let user = await Registration.findOne({ email: email.toLowerCase().trim() })
        if (user === null) {
            res.status(201).json({
                error: true,
                code: 201,
                message: "User not found.",
            })
        }
        else {
            const token = jwt.sign({ email }, secretKey);
            const isMatch = await handler.decryptPassword(password1, user.password)
            if (isMatch) {
                res.status(200).json({
                    error: false,
                    code: 200,
                    message: "User Logged In",
                    result: user,
                    token: token
                })
            }
            else {
                return res.status(201).send({
                    message: "Wrong Password"
                });
            }
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            error: true,
            code: 400,
            message: "sonthing went worng",
            data: error
        })
    }

};

exports.updatePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ error: true, message: "Email and new password are required" });
        }

        const user = await Registration.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await Registration.updateOne(
            { email: email.toLowerCase().trim() },
            { $set: { password: hashedPassword } }
        );

        res.status(200).json({ error: false, message: "Password updated successfully" });
    } catch (error) {
        console.error("Password update error:", error);
        res.status(500).json({ error: true, message: "Error updating password", details: error });
    }
};

/************************ Registration API for Users in KMS ************************ */

exports.Registration = async (req, res) => {
  try {
    // let profile_image = req.files["profile_image"] ? req.files["profile_image"][0].filename : "";

    let {
      name,
      mobile_number,
      email,
      password,
      user_role,
      admin_id,
      category,
      address,
      latitude,
      longitude,
      device,
      fcm_token
    } = req.body;

    // Validate required fields
    if (!name || !mobile_number || !email || !password || !user_role) {
      return res.status(400).json({ error: true, message: "Required fields are missing" });
    }

    // Check if user already exists
    let existingUser = await Registration.findOne({ mobile_number });
    if (existingUser) {
      return res.status(400).json({ error: true, message: "Mobile number already exists" });
    }

    // Hash the password
    let bPassword = await handler.bcryptPassword(password);

    // Create new user
    let newUser = new Registration({
      // profile_image,
      name,
      mobile_number,
      email: email.toLowerCase().trim(),
      password: bPassword,
      user_role,
      admin_id,
      category,
      address,
      latitude,
      longitude,
      device,
      fcm_token
    });

    let result = await newUser.save();
    res.status(200).json({ error: false, message: "Registered Successfully", data: result });

  } catch (error) {
    res.status(500).json({ error: true, message: "Something went wrong", data: error.message });
  }
};


// Update User
exports.UpdateUser = async (req, res) => {
    console.log("saasasasasassasasasaas")
    try {
        let profile_image = req.files["profile_image"] ? req.files["profile_image"][0].filename : null;
        let { userId, name, mobile_number, email, user_role, admin_id, category, password } = req.body;

        let updateData = { name, mobile_number, email, user_role, admin_id, category, password };
        if (profile_image) updateData.profile_image = profile_image;

        let updatedUser = await Registration.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) return res.status(404).json({ error: true, message: "User not found" });

        res.status(200).json({ error: false, message: "User updated successfully", data: updatedUser });
    } catch (error) {
        res.status(500).json({ error: true, message: "Something went wrong", data: error.message });
    }
};

// Delete User
exports.DeleteUser = async (req, res) => {
    try {
        let { userId } = req.body;
        let deletedUser = await Registration.findByIdAndDelete(userId);
        if (!deletedUser) return res.status(404).json({ error: true, message: "User not found" });

        res.status(200).json({ error: false, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: true, message: "Something went wrong", data: error.message });
    }
};

// Get User by ID
exports.GetUserById = async (req, res) => {
    try {
        let { userId } = req.body;
        let user = await Registration.findById(userId);
        if (!user) return res.status(404).json({ error: true, message: "User not found" });

        res.status(200).json({ error: false, message: "User retrieved successfully", data: user });
    } catch (error) {
        res.status(500).json({ error: true, message: "Something went wrong", data: error.message });
    }
};

// Get All Users
exports.GetAllUsers = async (req, res) => {
    try {
        let users = await Registration.find();
        res.status(200).json({ error: false, message: "Users retrieved successfully", data: users });
    } catch (error) {
        res.status(500).json({ error: true, message: "Something went wrong", data: error.message });
    }
};

// Get Users by Role
exports.GetUsersByRole = async (req, res) => {
    try {
        let { role } = req.body;
        let users = await Registration.find({ user_role: role });
        res.status(200).json({ error: false, message: "Users retrieved successfully", data: users });
    } catch (error) {
        res.status(500).json({ error: true, message: "Something went wrong", data: error.message });
    }
};



/////////////////////////////////////////////////////////////////////////////////////////////////////////
/************************************* new DEV API ************************************ */

// add language
exports.addLanguage = async (req, res) => {
    console.log("http://localhost:3007/addLanguage")
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: true, message: "Language name is required" });
    }

    // Check if language already exists
    const existingLang = await Language.findOne({ name: name.trim().toLowerCase() });
    if (existingLang) {
      return res.status(400).json({ error: true, message: "Language already exists" });
    }

    // Get the max order globally (not just per sub_topic_id)
    const lastDetail = await Language.findOne().sort({ order: -1 });
    const newOrder = lastDetail ? lastDetail.order + 1 : 1;

    const newLanguage = new Language({ 
        name: name.trim().toLowerCase() ,
        order: newOrder
    });
    const result = await newLanguage.save();

    return res.status(200).json({ error: false, message: "Language added successfully", data: result });
  } catch (error) {
    console.error("Error adding language:", error);
    return res.status(500).json({ error: true, message: "Something went wrong", data: error.message });
  }
};

// Read All
exports.getLanguages = async (req, res) => {
  try {
    const languages = await Language.find().sort({ name: 1 });
    res.status(200).json({ error: false, data: languages });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error fetching languages", data: error.message });
  }
};

// Get by id
exports.getLanguageById = async (req, res) => {
  try {

    const languages = await Language.findOne({_id: req.body.id});
    res.status(200).json({ error: false, data: languages });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error fetching languages", data: error.message });
  }
};

// Update
exports.updateLanguage = async (req, res) => {
  try {
    const { name, id } = req.body;

    const updated = await Language.findByIdAndUpdate(
      id,
      { name: name.toLowerCase().trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: true, message: "Language not found" });
    }

    res.status(200).json({ error: false, message: "Language updated", data: updated });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error updating language", data: error.message });
  }
};

// Delete
exports.deleteLanguage = async (req, res) => {
  try {
    const { id } = req.body;
    const deleted = await Language.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: true, message: "Language not found" });
    }

    res.status(200).json({ error: false, message: "Language deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error deleting language", data: error.message });
  }
};


// Add Topic
exports.addTopic = async (req, res) => {
  try {
    const { languageId, name, description } = req.body;

    if (!languageId || !name) {
      return res.status(400).json({ error: true, message: "Language ID and Topic name are required" });
    }

    // Get the max order globally (not just per sub_topic_id)
    const lastDetail = await Topic.findOne().sort({ order: -1 });
    const newOrder = lastDetail ? lastDetail.order + 1 : 1;

    const topic = new Topic({
      languageId,
      name: name.trim(),
      description,
      order: newOrder
    });

    const result = await topic.save();
    res.status(200).json({ error: false, message: "Topic added successfully", data: result });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error adding topic", data: error.message });
  }
};

// Get Topics by Language
exports.getTopicsByLanguage = async (req, res) => {
  try {
    const { languageId } = req.body;

    if (!languageId || languageId === "") {
      return res.status(400).json({ error: true, message: "Invalid languageId", data: null });
    }

    const topics = await Topic.find({ languageId }).sort({ name: 1 });

    res.status(200).json({ error: false, data: topics });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error fetching topics", data: error.message });
  }
};


// Get Topics by Language
exports.getTopicsById = async (req, res) => {
  try {
    const { topic_id } = req.body;
    const topics = await Topic.findOne({ _id : ObjectId(topic_id) })

    res.status(200).json({ error: false, data: topics });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error fetching topics", data: error.message });
  }
};

// Update Topic
exports.updateTopic = async (req, res) => {
  try {
    const { name, description, id } = req.body;

    const updated = await Topic.findByIdAndUpdate(
      id,
      { name: name.trim(), description },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: true, message: "Topic not found" });
    }

    res.status(200).json({ error: false, message: "Topic updated", data: updated });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error updating topic", data: error.message });
  }
};

// Delete Topic
exports.deleteTopic = async (req, res) => {
  try {
    const { id } = req.body;

    const deleted = await Topic.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: true, message: "Topic not found" });
    }

    res.status(200).json({ error: false, message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error deleting topic", data: error.message });
  }
};


// Add Subtopic
exports.addSubtopic = async (req, res) => {
  try {
    const { topicId, name, description } = req.body;

    if (!topicId || !name) {
      return res.status(400).json({ error: true, message: "Topic ID and Subtopic name are required" });
    }

    
    // Get the max order globally (not just per sub_topic_id)
    const lastDetail = await Subtopic.findOne().sort({ order: -1 });
    const newOrder = lastDetail ? lastDetail.order + 1 : 1;

    const subtopic = new Subtopic({
      topicId,
      name: name.trim(),
      description,
      order: newOrder
    });

    const result = await subtopic.save();
    res.status(200).json({ error: false, message: "Subtopic added successfully", data: result });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error adding subtopic", data: error.message });
  }
};

// Get Subtopics by Topic
exports.getSubtopicsByTopic = async (req, res) => {
  try {
    const { topicId } = req.body;
    const subtopics = await Subtopic.find({ topicId }).sort({ order: 1 });

    res.status(200).json({ error: false, data: subtopics });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error fetching subtopics", data: error.message });
  }
};

// Get Subtopics by id
exports.getSubtopicsById = async (req, res) => {
  try {
    const { sub_topic_id } = req.body;
    const subtopics = await Subtopic.find({ _id: ObjectId(sub_topic_id) })

    res.status(200).json({ error: false, data: subtopics });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error fetching subtopics", data: error.message });
  }
};

// Update Subtopic
exports.updateSubtopic = async (req, res) => {
  try {
    const { id } = req.body;
    const { name, description } = req.body;

    const updated = await Subtopic.findByIdAndUpdate(
      id,
      { name: name.trim(), description },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: true, message: "Subtopic not found" });
    }

    res.status(200).json({ error: false, message: "Subtopic updated", data: updated });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error updating subtopic", data: error.message });
  }
};

// Delete Subtopic
exports.deleteSubtopic = async (req, res) => {
  try {
    const { id } = req.body;

    const deleted = await Subtopic.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: true, message: "Subtopic not found" });
    }

    res.status(200).json({ error: false, message: "Subtopic deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error deleting subtopic", data: error.message });
  }
};


// Add Detail
exports.addDetail = async (req, res) => {
  try {
    const { sub_topic_id, video_url, description, example } = req.body;

    if (!sub_topic_id) {
      return res.status(400).json({ error: true, message: "sub_topic_id is required" });
    }

    // Get the max order globally (not just per sub_topic_id)
    const lastDetail = await Detail.findOne().sort({ order: -1 });
    const newOrder = lastDetail ? lastDetail.order + 1 : 1;


    const detail = new Detail({
      sub_topic_id,
      video_url,
      description,
      example,
      order: newOrder
    });

    const result = await detail.save();
    res.status(200).json({ error: false, message: "Detail added successfully", data: result });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error adding detail", data: error.message });
  }
};

// Get Details by Sub Topic ID
exports.getAllDetails = async (req, res) => {
  try {

    const details = await Detail.find({ }).sort({ order: 1 });
    res.status(200).json({ error: false, data: details });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error fetching details", data: error.message });
  }
};

// Get Details by Sub Topic ID
exports.getDetailsBySubTopic = async (req, res) => {
  try {
    const { sub_topic_id } = req.body;

    const details = await Detail.find({ sub_topic_id }).sort({ createdAt: -1 });
    res.status(200).json({ error: false, data: details });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error fetching details", data: error.message });
  }
};

// Get Detail by ID
exports.getDetailById = async (req, res) => {
  try {
    const { id } = req.body;

    const detail = await Detail.findById(id);
    if (!detail) {
      return res.status(404).json({ error: true, message: "Detail not found" });
    }

    res.status(200).json({ error: false, data: detail });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error fetching detail", data: error.message });
  }
};

// Update Detail
exports.updateDetail = async (req, res) => {
  try {
    const { id, video_url, description, example } = req.body;

    const updated = await Detail.findByIdAndUpdate(
      id,
      {
        video_url,
        description,
        example,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: true, message: "Detail not found" });
    }

    res.status(200).json({ error: false, message: "Detail updated", data: updated });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error updating detail", data: error.message });
  }
};

// Delete Detail
exports.deleteDetail = async (req, res) => {
  try {
    const { id } = req.body;

    const deleted = await Detail.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: true, message: "Detail not found" });
    }

    res.status(200).json({ error: false, message: "Detail deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Error deleting detail", data: error.message });
  }
};





