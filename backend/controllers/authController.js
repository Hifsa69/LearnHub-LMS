const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        //Check if user already exists
        if (
            typeof name !== "string" || 
            typeof email !== "string" || 
            typeof password !== "string"
        ) {
            return res.status(400).json({
                message: "Name, email and password must be valid text",
            });
        }
        if (name.trim().length < 2) {
            return res.status(400).json({
                message: "Name must contain at least 2 characters",
            });
        }
        if (password.length < 6){
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailPattern.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address",
            });
        }

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });
        if (existingUser) {
            return res.status(400).json({ 
                message: "User already exists" 
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "student",
        });

        res.status(201).json({
            message: "User registered successfully",
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        if(error.code === 11000) {
            return res.status(409).json({
                message: "User already exists",
            });
        }
        console.error("Registration error:", error.message);

        res.status(500).json({ 
            message: "Error registering user",
         });
    }
};

//Login User
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        //Check fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        if(typeof email !== "string" || typeof password !=="string") {
            return res.status(400).json({
                message:"Email and password must be valid text",
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({
            email: normalizedEmail,
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        //Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if(!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        //Create JWT Token
        if(!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from enviroment variables");
            return res.status(500).json({
                message:"Server configuration error",
            });
        }

        const token = jwt.sign (
            {
            id: user._id.toString(),
            role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"1d"
            }
        );

        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role 
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({
            message: "Login failed",
        });
    }
};

module.exports = {
    registerUser,
    loginUser 
};