const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const mongoose = require("mongoose");

const enrollCourse = async(req, res) => {
    try {
        const { courseId } = req.body;

        if(!courseId || !mongoose.isValidObjectId(courseId)){
            return res.status(400).json({
                message:"A valid course ID is required"
            });
        }
        const course = await Course.findById(courseId);
        if(!course) {
            return res.status(404).json({
                message:"Course not found"
            });
        }

        const existingEnrollment = await Enrollment.findOne({
            student:req.user.id,
            course: courseId 
        });
        if(existingEnrollment) {
            return res.status(400).json ({
                message: "You are already enrolled in this course"
            });
        }
        const enrollment = await Enrollment.create({
            student: req.user.id,
            course: courseId,
            progress:0
        });
        const populateEnrollment = await Enrollment.findById(
            enrollment._id 
        ).populate({
            path:"course",
            populate: {
                path:"instructor",
                select:"name email"
            }
        });
        return res.status(201).json({
            message:"Successfully enrolled in the course",
            enrollment:populateEnrollment
        });
    } catch (error) {
        if (error.code ===11000) {
            return res.status(400).json({
                message:"You are already enrolled in this course"
            });
        }
        console.error("Enrollment error:",error.message);
        return res.status(500).json({
            message:"Enrollment failed",
        });
    }
};

const getMyCourses=async (req,res) => {
    try {
        const enrollment = await Enrollment.find({
            student: req.user.id 
        })
        .populate({
            path:"course",
            populate: {
                path:"instructor",
                select:"name email"
            }
        })
        .sort({createdAt: -1});

        return res.status(200).json({
            count: enrollment.length,
            courses: enrollment
        });
    } catch (error) {
        console.error("Get my courses error:",error.message);
        return res.status(500).json({
            message:"Unable to fetch enrolled courses",
        });
    }
};

const completeLesson = async (req, res) => {
    try {
        const { courseId, lessonId } = req.body;

        if (
            !mongoose.isValidObjectId(courseId) ||
            !mongoose.isValidObjectId(lessonId)
        ) {
            return res.status(400).json({
                message: "Valid course and lesson IDs are required"
            });
        }

        const lesson = await Lesson.findOne({
            _id: lessonId,
            course: courseId
        });

        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found in this course"
            });
        }

        const enrollment = await Enrollment.findOne({
            student: req.user.id,
            course: courseId
        });

        if (!enrollment) {
            return res.status(403).json({
                message: "You are not enrolled in this course"
            });
        }

        if (!enrollment.completedLessons) {
            enrollment.completedLessons = [];
        }

        const alreadyCompleted = enrollment.completedLessons.some(
            (id) => id.toString() === lessonId
        );

        if (!alreadyCompleted) {
            enrollment.completedLessons.push(lessonId);

            const totalLessons = await Lesson.countDocuments({
                course: courseId
            });

            enrollment.progress = totalLessons
                ? Math.round(
                    (enrollment.completedLessons.length / totalLessons) * 100
                )
                : 0;

            await enrollment.save();
        }

        return res.status(200).json({
            message: "Lesson marked as completed",
            progress: enrollment.progress,
            completedLessons: enrollment.completedLessons
        });
    } catch (error) {
        console.error("Complete lesson error:", error.message);
        return res.status(500).json({
            message: "Unable to update lesson progress"
        });
    }
};

module.exports = {
    enrollCourse,
    getMyCourses,
    completeLesson 
};