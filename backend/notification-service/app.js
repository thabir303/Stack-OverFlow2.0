const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const notificationRoutes = require("./routes/notificationRoutes");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());

// Middleware
app.use(express.json());

// app.use(cors(  { origin: "*" } ));

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
