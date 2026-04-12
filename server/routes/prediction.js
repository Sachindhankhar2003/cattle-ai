const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const Prediction = require('../models/Prediction');
const auth = require('../middleware/auth');

// Multer Config
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
});

// @route   POST api/prediction/predict
// @desc    Upload image and get prediction
router.post('/predict', [auth, upload.single('image')], async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'No image uploaded' });

        const imagePath = req.file.path;
        
        // Prepare data for Python AI service
        const formData = new FormData();
        formData.append('image', fs.createReadStream(imagePath));

        // Call Python Flask API
        const response = await axios.post('http://localhost:8000/predict', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        const { prediction, confidence, top3, info } = response.data;

        const newPrediction = new Prediction({
            userId: req.user.id,
            imageName: req.file.filename,
            imageUrl: `/uploads/${req.file.filename}`,
            breed: prediction,
            confidence: confidence,
            top3: top3,
            metadata: info
        });

        await newPrediction.save();

        res.json(newPrediction);
    } catch (err) {
        if (err.response) {
            console.error('Python API Error Data:', err.response.data);
            console.error('Python API Status:', err.response.status);
        } else {
            console.error('Prediction Route Error:', err.message);
        }
        res.status(500).json({ 
            msg: 'Prediction Service Error. Make sure AI service is running.', 
            error: err.response?.data?.error || err.message,
            trace: err.response?.data?.trace
        });
    }
});

// @route   GET api/prediction/history
// @desc    Get user's prediction history
router.get('/history', auth, async (req, res) => {
    try {
        const history = await Prediction.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET api/prediction/stats
// @desc    Get system stats for admin
router.get('/stats', auth, async (req, res) => {
    try {
        // Simple admin check (this should be more robust)
        if (req.user.role !== 'admin') return res.status(401).json({ msg: 'Not authorized' });

        const totalPredictions = await Prediction.countDocuments();
        const breedStats = await Prediction.aggregate([
            { $group: { _id: "$breed", count: { $sum: 1 } } }
        ]);

        res.json({ totalPredictions, breedStats });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
