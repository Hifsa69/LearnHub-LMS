const Course = require("../models/Course");
const User = require("../models/User");
const mongoose = require("mongoose");

//GET all courses
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
        .populate("instructor", "name email");

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch courses",
            error: error.message 
        });
    }
};

//GET single course
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
        .populate("instructor", "name email");

        if(!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error("Get course error:",error.message);
        res.status(500).json({
           message: "Failed to fetch course" 
        });
    }
};

//POST create course
const createCourse = async (req, res) => {
    try {
        const {
            title,
            description,
            instructor,
            category,
            price
        } = req.body;

        if(!title?.trim()
             || !description?.trim() || !category?.trim()) {
            return res.status(400).json({
                message: "Title, description and category are required"
            });
        }

        let instructorId;
        if(req.user.role === "instructor") {
            instructorId = req.user.id;
        } else {
            if(!instructor || !mongoose.isValidObjectId(instructor)) {
                return res.status(400).json({
                    message: "Instructor is required and must be a valid ID"
                });
            }
            instructorId = instructor;
        }

        const instructorUser = await User.findById(instructorId);
        if(!instructorUser || 
            !["instructor", "admin"].includes(instructorUser.role)) {
            return res.status(400).json({
                message: "Selected instructor account is invalid" 
            });
        }

        const parsedPrice = price === undefined || price === "" ? 0 : Number(price);
        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({
                message: "Price must be a valid non-negative number"
            });
        }

        const course = await Course.create({
            title: title.trim(),
            description: description.trim(),
            instructor: instructorId,
            category: category.trim(),
            price: parsedPrice
        });

        const populateCourse = await course.populate(
            "instructor",
            "name email"
        );

        res.status(201).json({
            message: "Course created sucessfully",
            course: populateCourse
        });
        } catch (error) {
            console.error("Create course error:", error.message);
            res.status(500).json({
                message: "Failed to create courses"
            });
        }
};

//PUT update course
const updateCourse = async(req, res) => {
    try {
        const { id } = req.params;
        if(!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }
        const course = await Course.findById(id);
            if (!course) {
                return res.status(404).json({
                    message: "Course not found"
                });
            }

            if (
                req.user.role === "instructor" && 
                course.instructor.toString() !== req.user.id 
            ) { 
                return res.status(403).json({
                    message: "You are not the owner of this course"
                });
            }

            const {
                title,
                description,
                instructor,
                category,
                price
            } = req.body;

            if(title !== undefined) {
                if (typeof title !== "string" || !title.trim()){
                    return res.status(400).json({
                        message: "Title must be a non-empty string"
                    });
                }
                course.title = title.trim();
            }

            if(description !== undefined) {
                if (typeof description !== "string" || !description.trim()){
                    return res.status(400).json({
                        message: "Description must be a non-empty string"
                    });
                }
                course.description = description.trim();
            }
            if(category !== undefined) { 
                if (typeof category !== "string" || !category.trim()){ 
                    return res.status(400).json({
                        message: "Category must be a non-empty string"
                    });
                }
                course.category = category.trim();
            }
            if(price !== undefined) {
                const parsedPrice = Number(price);
                if (!Number.isFinite(parsedPrice) || parsedPrice < 0) { 
                    return res.status(400).json({
                        message: "Price must be a valid non-negative number"
                    });
                }
                course.price = parsedPrice;
            }

            if (instructor !== undefined) {
                if (req.user.role !== "admin") {
                    return res.status(403).json({
                        message: "Only admins can change course ownership"
                    });
                }
                if (!mongoose.isValidObjectId(instructor)) {
                    return res.status(400).json({
                        message: "Instructor must be a valid ID"
                    });
                }
                const instructorUser = await User.findById(instructor);
                if (!instructorUser || 
                    !["instructor", "admin"].includes(instructorUser.role)) {
                    return res.status(400).json({
                        message: "Selected instructor account is invalid"
                    });
                }
                course.instructor = instructor;
            }
            await course.save();
            await course.populate("instructor", "name email");
            res.status(200).json({
                message: "Course updated successfully",
                course 
            });
    } catch (error) {
        console.error("Update course error:", error.message);
        res.status(500).json({
            message: "Failed to update course",
        });
    }
};

//DELETE course
const deleteCourse = async(req,res)=>{
    try {
        const { id }= req.params;
        if(!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        const course = await Course.findById(id);

        if(!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if (req.user.role === "instructor" && 
            course.instructor.toString() !== req.user.id 
        ) {
            return res.status(403).json({
                message: "You can only delete your own courses"
            });
        }

        await course.deleteOne();

        res.status(200).json({
            message: "Course Deleted successfully"
        });
    } catch (error) {
        console.error("Delete course error:", error.message);
        res.status(500).json({
            message: "Failed to delete course",
            error: error.message 
        });  
    }
};

module.exports = {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse 
};