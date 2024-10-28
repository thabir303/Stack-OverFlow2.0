// app.js
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./api/auth');
const postRoutes = require('./api/post');
const notificationRoutes = require('./api/notification');
dotenv.config(); 

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes); 
app.use('/api/posts', postRoutes);
app.use('/api/notifications',notificationRoutes);

mongoose.connect(process.env.DB, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
