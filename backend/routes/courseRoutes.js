const express = require("express");

const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");
 
const {
    protect,
    authorizeRoles 
} = require("../middleware/authMiddleware");

const router = express.Router();

//GET all courses
router.get("/", getCourses);

//GET single course
router.get("/:id", getCourseById);

router.post(
    "/", protect,
    authorizeRoles("admin", "instructor"),
    createCourse 
);

router.put (
    "/:id", protect,authorizeRoles("admin","instructor"),
    updateCourse 
);

router.delete(
   "/:id",protect,
   authorizeRoles("admin", "instructor"),
   deleteCourse  
);

module.exports = router;