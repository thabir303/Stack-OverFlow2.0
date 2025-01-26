//backend/user-service/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        // Generate JWT with email included
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email }, // Add email to payload
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        );

        res.status(201).json({ message: 'User registered successfully.', token });
    } catch (error) {
        console.error("Error during signup:", error.message);
        res.status(500).json({ message: 'Server error.' });
    }
};


exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        // Generate JWT with email included
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Add email to payload
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error during signin:", error.message);
        res.status(500).json({ message: 'Server error.' });
    }
};



exports.getAllUsers = async (req, res) => {
    try {
        const apiKey = req.headers["x-api-key"];

        // Authenticate API Key
        if (apiKey && apiKey === process.env.USER_SERVICE_API_KEY) {
            console.log("Authenticated using API Key.");
        } else {
            // If no API key, use JWT for authentication
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: "Unauthorized: No token provided." });
            }

            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Unauthorized: Invalid token." });
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                req.user = decoded; // Attach the decoded token to `req.user`
            } catch (error) {
                console.error("JWT verification failed:", error.message);
                return res.status(401).json({ message: "Unauthorized: Invalid token." });
            }
        }

        const requestingUserId = req.user?.id; // Extract the user ID from the decoded token

        // Fetch all users except the requesting user
        const users = await User.find({ _id: { $ne: requestingUserId } }).select("-password");

        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

