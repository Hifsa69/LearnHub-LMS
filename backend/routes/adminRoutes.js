const express = require("express");

const {
    getAdminAnalytics,
    getAllUsers,
    updateUserRole,
    deleteUser,
} = require ("../controllers/adminController");
const {
    protect,
    authorizeRoles 
} = require("../middleware/authMiddleware");

const router = express.Router();
 router.use(protect, authorizeRoles("admin"));
router.get("/analytics",getAdminAnalytics);
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

module.exports = router;