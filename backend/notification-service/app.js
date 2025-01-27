//backedn/notification-service/app.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const notificationRoutes = require("./routes/notificationRoutes");
const cors = require("cors");
const notificationCleaner = require("./controllers/notificationCleaner"); // Import the notification cleaner

dotenv.config();
const app = express();

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:8003', 'http://localhost:8002', 'http://localhost:8001', 'http://localhost:8000',],
    // origin: true,
    credentials: true,
  };
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use("/api/notifications", notificationRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Notification Service: Connected to MongoDB"))
    .catch((err) => console.error(err));

// Start the server
const PORT = process.env.PORT || 8003;
app.listen(PORT, () =>
    console.log(`Notification Service running on port ${PORT}`)
);

notificationCleaner();