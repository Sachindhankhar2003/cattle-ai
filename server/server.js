const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/buffalo_db';
mongoose.connect(mongoURI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
    });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/prediction', require('./routes/prediction'));

// Default Route
app.get('/', (req, res) => {
    res.json({ message: 'Buffalo Breed Recognition API is running...' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
