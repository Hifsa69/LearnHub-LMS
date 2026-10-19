const express = require("express");
const {
    enrollCourse,
    getMyCourses,
    completeLesson
} = require("../controllers/enrollmentController");

const { protect, 
    authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();
//Student enrolls in a course
router.post(
    "/enroll",
    protect,
    authorizeRoles("student"),
    enrollCourse 
);
//Get course enrolled by logged-in student
router.get(
    "/my-courses",
    protect,
    authorizeRoles("student"),
    getMyCourses 
);
router.patch(
    "/enroll/complete-lesson",
    protect,
    authorizeRoles("student"),
    completeLesson
);
module.exports = router;
