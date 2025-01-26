////backend/post-service/app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postRoutes = require('./routes/postRoutes'); // Ensure this file exists and is correctly implemented
const cors = require('cors');
// Configure environment variables
dotenv.config();

// Create an Express application
const app = express();

const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:8003', 'http://localhost:8002', 'http://localhost:8001', 'http://localhost:8000',],
    // origin: true,
    credentials: true,
  };
app.use(cors(corsOptions));


// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/posts', postRoutes);

// MongoDB connection
const dbURI = process.env.DB; // Ensure DB is defined in your .env file
if (!dbURI) {
  console.error('Error: Missing MongoDB connection string in .env file (DB variable).');
  // process.exit(1); // Exit the application if DB is missing
}

mongoose.connect(dbURI)
  .then(() => console.log('Post Service: Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the application if the connection fails
  });

// Start the server
const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  console.log(`Post Service running on port ${PORT}`);
});
