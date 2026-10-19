const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

const getAdminAnalytics = async (req, res) => {
    try {
        const[
            totalUsers,
            totalCourses,
            totalEnrollments,
            totalStudents,
            totalInstructors
        ] =await Promise.all([
            User.countDocuments(),
            Course.countDocuments(),
            Enrollment.countDocuments(),
            User.countDocuments({ role: "student" }),
            User.countDocuments({ role: "instructor" })
        ]);
        res.status(200).json({
            success:true,
            analytics:{
                totalUsers,
                totalCourses,
                totalEnrollments,
                totalStudents,
                totalInstructors
            }
        });
    } catch (error) {
        console.error("Admin analytics error:", error.message);
        res.status(500).json({
            message:"Failed to fetch admin analytics"
        });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password")
        .sort({ createdAt: -1 });
        return res.status(200).json({
            count: users.length,
            users
        });
    } catch (error) {
        console.error("Get all users error:", error.message);
        return res.status(500).json({
            message: "Failed to fetch users"
        });
    }
};
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!role || !["student", "instructor", "admin"].includes(role)) {
            return res.status(400).json({
                message: "Invalid role. Must be 'student', 'instructor', or 'admin'."
            });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                message: "You cannot change your own role"
            });
        }

        if (
            user.role === "admin" && 
            role !== "admin"
        ) {
            const adminCount = await User.countDocuments({
                role:"admin"
            });
            if(adminCount <=1) {
                return res.status(400).json({
                    message: "Cannot change the role of the last admin"
                });
            }
        }

        user.role = role;
        await user.save();

        return res.status(200).json({
            message: "User role updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Update user role error:", error.message);
        return res.status(500).json({
            message: "Failed to update user role"
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                message: "You cannot delete your own account"
            });
        }
        if (user.role === "admin") {
            const adminCount = await User.countDocuments ({
                role: "admin"
            });
            if (adminCount <= 1) {
                return res.status(400).json({
                    message: "Cannot delete the last admin"
                });
            }
        }
        const ownedCourseIds = await Course.find({
            instructor: user._id
        }).distinct("_id");
        await Enrollment.deleteMany({
            $or: [
                { student: user._id },
                { course: {$in: ownedCourseIds }}
            ]  
        });
        await Course.deleteMany({
            instructor: user._id 
        });
        await User.findByIdAndDelete(user._id);
        return res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Delete user error:", error.message);
        return res.status(500).json({
            message: "Failed to delete user"
        });
    }
};
module.exports = {
    getAdminAnalytics,
    getAllUsers,
    updateUserRole,
    deleteUser
};