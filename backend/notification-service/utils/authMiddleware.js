//notification-service/utils/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    const authHeader = req.headers.authorization;

    // Debugging logs
    console.log("API Key:", apiKey);
    console.log("API Key Received:", req.headers["x-api-key"]);
    console.log("Authorization Header:", authHeader);

    // Handle API Key authentication
    if (apiKey && apiKey === process.env.NOTIFICATION_SERVICE_API_KEY) {
        console.log("Authenticated using API Key.");
        return next(); // Proceed if API Key is valid
    }
    console.log(`Hello ${apiKey}`);
    

    // Handle JWT authentication
    if (!authHeader) {
        console.log("Authorization header missing.");
        return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token
    console.log("Token received:", token);

    if (!token) {
        console.log("Token missing.");
        return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify token
        console.log("Token decoded successfully:", decoded);
        req.user = decoded; // Attach user info to the request
        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }
};

module.exports = authMiddleware;
