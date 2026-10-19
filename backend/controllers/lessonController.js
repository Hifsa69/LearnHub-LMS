const Enrollment = require("../models/Enrollment");
const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const mongoose = require("mongoose");

const createLesson = async(req, res) => {
    try {
        const {title, description, courseId, videoUrl, order } = req.body;
        if (!title || !description || !courseId) {
            return res.status(400).json ({
                message: "Title, description, and course ID are required"
            });
        }
        if(!mongoose.isValidObjectId(courseId)) {
            return res.status(400).json ({
                message: "Invalid course ID"
            });
        }
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }
        //Instructor can only add lesson to their own courses
        if(
            req.user.role === "instructor" && 
            course.instructor.toString() !== req.user.id 
        ) {
            return res.status(403).json ({
                message: "You can only add lessons to your own courses"
            });
        }
        const lesson = await Lesson.create({
            title: title.trim(),
            description: description.trim(),
            course: courseId,
            instructor: course.instructor,
            videoUrl: videoUrl || "",
            order: order || 1 
        });
        return res.status(201).json({
            message: "Lesson created successfully",
            lesson
        });
    } catch (error) {
        console.error("Create lesson error: ", error.message);
        return res.status(500).json({
            message: "Unable to create lesson"
        });
    }
};

//Get lessons for a course
const getCourseLessons = async (req,res) => {
    try {
        const {courseId} = req.params;
        if (!mongoose.isValidObjectId(courseId)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }
        if (req.user.role === "student") {
    const enrollment = await Enrollment.findOne({
        student: req.user.id,
        course: courseId
    });

    if (!enrollment) {
        return res.status(403).json({
            message: "Please enroll in this course to access its lessons"
        });
    }
}
        const lessons = await Lesson.find({course: courseId})
        .sort({order: 1, createdAt: 1});
        return res.status(200).json({
            count: lessons.length,
            lessons
        });
    } catch (error) {
        console.error("Get lessons error: ", error.message);
        return res.status(500).json({
            message: "Unable to fetch lessons"
        });
    }
};
module.exports ={
    createLesson,
    getCourseLessons 
};