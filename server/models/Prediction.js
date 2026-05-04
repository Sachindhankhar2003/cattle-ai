const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String, // Path to local storage or Cloudinary URL
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    confidence: {
        type: Number,
        required: true
    },
    top3: [
        {
            breed: String,
            score: Number
        }
    ],
    metadata: {
        origin: String,
        milkProduction: String,
        characteristics: String,
        description: String
    },
    imageHash: {
        type: String,
        required: false
    },
    imageQuality: {
        animal_detected: Boolean,
        lighting_sufficient: Boolean,
        background_clutter: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
