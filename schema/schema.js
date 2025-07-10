const mongoose = require("mongoose");
const ObjectId = require('mongoose').Types.ObjectId;


// const questionSchema = new mongoose.Schema({
//     // scenario: String,
//     question: String,
//     pre: String,
//     options: {
//         type: Array,
//         default: [
//             {
//                 option: String,
//                 next: String
//             }
//         ]
//     },
//     tables: [],
//     files: [],
//     linked: {},
//     scene: String,
//     newData: { default: 1, type: Number },
//     start: { type: Number, default: 0 },

//     created_date: {
//         type: Date,
//         default: Date.now
//     },

//     is_final: { type: Number, default: 0 },
//     type: String

// });
// const Question = mongoose.model("Questions", questionSchema);

const registrationSchema = new mongoose.Schema({
    profile_image: String,
    name: String,
    mobile_number: String,
    email: String,
    password: String,
    address: String,
    user_role: String,
    category: String,
    admin_id: String,
    is_deleted: { type: Number, default: 0 },
    status: { type: Number, default: 1 }
},
    { timestamps: true });
const Registration = mongoose.model("users", registrationSchema);


/**************************** Schema ****************************** */


const LanguageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Prevent duplicates
        trim: true
    },
    is_deleted: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Language = mongoose.model("languages", LanguageSchema);

const topicSchema = new mongoose.Schema({
    languageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "languages",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    is_deleted: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Topic = mongoose.model("topics", topicSchema);


const subtopicSchema = new mongoose.Schema({
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "topics",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    is_deleted: { type: Number, default: 0 },
    status: { type: Number, default: 1 },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Subtopic = mongoose.model("subtopics", subtopicSchema);








module.exports = {
    // Question,

    // New DEV // 
    Registration,
    Language,
    Topic,
    Subtopic





}