const mongoose = require("mongoose");
const lessonSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true 
        },
        description: {
            type: String,
            required: true,
            trim:true
        }, 
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true 
        },
        videoUrl: {
            type: String,
            trim: true,
            default: ""
        },
        order: {
            type: Number,
            default: 1,
            min: 1 
        }
    },
    {
        timestamps:true
    }
);
module.exports = mongoose.model("Lesson", lessonSchema);