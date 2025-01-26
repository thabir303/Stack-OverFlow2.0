//user-service/utils/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];

    // Handle API Key authentication
    if (apiKey && apiKey === process.env.USER_SERVICE_API_KEY) {
        return next(); // Proceed if API Key is valid
    }

    // Handle JWT authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify token
        req.user = decoded; // Attach user info to the request
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }
};

module.exports = authMiddleware;