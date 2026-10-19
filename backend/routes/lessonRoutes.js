const express = require ("express");
const {
    createLesson,
    getCourseLessons
} = require("../controllers/lessonController");
const{
    protect,
    authorizeRoles
}= require("../middleware/authMiddleware");
const router = express.Router();
//Create a lesson
router.post(
    "/",
    protect,
    authorizeRoles("admin","instructor"),
    createLesson
);
//Get lessons for a course
router.get(
    "/course/:courseId",
    protect,
    getCourseLessons
);
module.exports = router;