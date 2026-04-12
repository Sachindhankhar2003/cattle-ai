# Buffalo Cattle Image-Based Breed Recognition

An AI-powered web application for identifying buffalo breeds using deep learning. This project is designed for researchers, farmers, and veterinarians.

## 🚀 Features

- **AI Recognition**: Identify Murrah, Nili-Ravi, Jaffarabadi, Mehsana, and Surti breeds.
- **Dynamic Dashboard**: View confidence scores and top 3 predictions.
- **Breed Insights**: Detailed information about origin, milk production, and characteristics.
- **User Authentication**: Secure JWT-based login and registration.
- **History Tracking**: Personal log of all previous predictions.
- **Premium UI**: Responsive, dark-themed interface with glassmorphism aesthetics.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **AI Service**: Python, Flask, TensorFlow, Keras, MobileNetV2.

## 📋 Prerequisites

- Node.js (v16+)
- Python (3.8+)
- MongoDB (Local or Atlas)

## 🏃 Getting Started

### 1. AI Service Setup
```bash
cd ai-service
pip install -r requirements.txt
# To train the model (requires dataset/ folder with breed subfolders)
python train.py 
# To start the inference API
python predict_api.py
```

### 2. Backend Setup
```bash
cd server
npm install
# Create a .env file with your MONGO_URI and JWT_SECRET
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 📂 Project Structure

- `/client`: React frontend application.
- `/server`: Node.js Express API.
- `/ai-service`: Python Flask API and Model Training scripts.
- `/uploads`: Directory for stored images (managed by server).

## 📊 Dataset Structure (For Training)
If you wish to retrain the model, organize your images like this:
```
ai-service/dataset/
├── Murrah/
├── Nili-Ravi/
├── Jaffarabadi/
├── Mehsana/
└── Surti/
```

## 📝 License
This project is part of a Capstone Project.
