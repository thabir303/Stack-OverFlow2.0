//backend/user-service/app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const cors = require("cors");

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
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('User Service: Connected to MongoDB'))
    .catch(err => console.error(err));

// Start the server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`User Service running on port ${PORT}`));
