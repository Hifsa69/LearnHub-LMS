const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.json({
        message: "LearnHub LMS API is running"
    });

});
app.use("/", authRoutes);
app.use("/",enrollmentRoutes);
app.use("/admin",adminRoutes);
app.use("/courses", courseRoutes);
app.use("/lessons", lessonRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});