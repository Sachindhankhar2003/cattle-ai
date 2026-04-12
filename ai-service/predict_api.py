from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import os
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Load the model
MODEL_PATH = 'buffalo_breed_model.h5'
CLASSES_PATH = 'classes.txt'

model = None
classes = [
    'Holstein', 'Jersey', 'Gir', 'Sahiwal', 'Red Sindhi', 'Tharparkar', 'Kankrej',
    'Murrah', 'Mehsana', 'Surti', 'Jaffarabadi', 'Nili-Ravi', 'Bhadawari',
    'Sirohi', 'Beetal', 'Jamunapari'
]

if os.path.exists(MODEL_PATH):
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ Model loaded successfully")
else:
    print("⚠️ Model file not found. Prediction will use dummy data or fail.")

if os.path.exists(CLASSES_PATH):
    with open(CLASSES_PATH, 'r') as f:
        classes = [line.strip() for line in f.readlines()]

def get_breed_info(breed_name):
    info = {
        # Buffaloes
        'Murrah': {'type': 'Buffalo', 'origin': 'Haryana, India', 'milkProduction': '2,000 - 2,500 kg', 'characteristics': 'Black, curved horns, massive body', 'description': 'The most popular dairy buffalo.'},
        'Nili-Ravi': {'type': 'Buffalo', 'origin': 'Punjab', 'milkProduction': '1,800 - 2,500 kg', 'characteristics': 'White markings on face/legs', 'description': 'Known as the "Black Gold".'},
        'Jaffarabadi': {'type': 'Buffalo', 'origin': 'Gujarat, India', 'milkProduction': '2,000 - 2,700 kg', 'characteristics': 'Drooping horns, heavy forehead', 'description': 'Heaviest buffalo breed.'},
        'Mehsana': {'type': 'Buffalo', 'origin': 'Gujarat, India', 'milkProduction': '1,200 - 1,500 kg', 'characteristics': 'Intermediate Murrah/Surti features', 'description': 'Consistent yield cross-breed.'},
        'Surti': {'type': 'Buffalo', 'origin': 'Gujarat, India', 'milkProduction': '1,300 - 1,500 kg', 'characteristics': 'Sickle horns, medium size', 'description': 'High fat content in milk.'},
        'Bhadawari': {'type': 'Buffalo', 'origin': 'Uttar Pradesh, India', 'milkProduction': '800 - 1,000 kg', 'characteristics': 'Copper colored body, wedge shape', 'description': 'Famous for extremely high butterfat.'},
        
        # Cows
        'Holstein': {'type': 'Cow', 'origin': 'Netherlands', 'milkProduction': '7,000 - 10,000 kg', 'characteristics': 'Black and white spots, large frame', 'description': 'Highest milk producer globally.'},
        'Jersey': {'type': 'Cow', 'origin': 'Jersey Island, UK', 'milkProduction': '4,000 - 5,000 kg', 'characteristics': 'Fawn color, prominent eyes, small', 'description': 'Produces golden, high-fat milk.'},
        'Gir': {'type': 'Cow', 'origin': 'Gujarat, India', 'milkProduction': '2,100 kg', 'characteristics': 'Red with white spots, prominent forehead', 'description': 'Famous Indian dairy breed.'},
        'Sahiwal': {'type': 'Cow', 'origin': 'Punjab', 'milkProduction': '2,200 kg', 'characteristics': 'Reddish brown, tick resistant', 'description': 'Best indigenous dairy cow of India/Pakistan.'},
        'Red Sindhi': {'type': 'Cow', 'origin': 'Sindh', 'milkProduction': '1,800 kg', 'characteristics': 'Deep red color, compact body', 'description': 'Highly heat tolerant.'},
        'Tharparkar': {'type': 'Cow', 'origin': 'Thar Desert', 'milkProduction': '1,700 kg', 'characteristics': 'White/light grey, lyre horns', 'description': 'Dual-purpose, thrives in deserts.'},
        'Kankrej': {'type': 'Cow', 'origin': 'Gujarat, India', 'milkProduction': '1,750 kg', 'characteristics': 'Silver-grey, large crescent horns', 'description': 'One of the heaviest Indian cattle.'},
        
        # Goats
        'Sirohi': {'type': 'Goat', 'origin': 'Rajasthan, India', 'milkProduction': '0.5 - 1 kg/day', 'characteristics': 'Brown with patches, flat leaf ears', 'description': 'Dual purpose, highly adaptable.'},
        'Beetal': {'type': 'Goat', 'origin': 'Punjab', 'milkProduction': '2 - 3 kg/day', 'characteristics': 'Black/red, roman nose, long ears', 'description': 'Excellent dairy goat.'},
        'Jamunapari': {'type': 'Goat', 'origin': 'Uttar Pradesh, India', 'milkProduction': '2 - 2.5 kg/day', 'characteristics': 'White color, highly pendulous ears', 'description': 'The largest goat breed in India.'}
    }
    return info.get(breed_name, {
        'type': 'Unknown Cattle',
        'origin': 'Unknown',
        'milkProduction': 'Unknown',
        'characteristics': 'N/A',
        'description': 'Information not available for this breed/species.'
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        import traceback
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        img = img.resize((224, 224))
        
        # Preprocess
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0
        
        if model:
            predictions = model.predict(img_array)[0]
            top_indices = predictions.argsort()[-3:][::-1]
            
            results = []
            for idx in top_indices:
                results.append({
                    'breed': classes[idx],
                    'confidence': float(predictions[idx])
                })
            
            main_breed = results[0]['breed']
            confidence = results[0]['confidence']
        else:
            import random
            # Dummy prediction if model not found for dev purposes
            main_breed = random.choice(classes)
            confidence = 0.85
            results = [
                {'breed': str(main_breed), 'confidence': float(confidence)},
                {'breed': str(random.choice(classes)), 'confidence': 0.10},
                {'breed': str(random.choice(classes)), 'confidence': 0.05}
            ]

        # Get additional info
        breed_info = get_breed_info(main_breed)
        
        return jsonify({
            'prediction': main_breed,
            'confidence': confidence,
            'top3': results,
            'info': breed_info
        })
    except Exception as e:
        trace = traceback.format_exc()
        print("PYTHON CRASH:", trace)
        return jsonify({'error': str(e), 'trace': trace}), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)
