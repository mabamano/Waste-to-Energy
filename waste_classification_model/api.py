from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
from combined_classifier import CombinedClassifier

app = Flask(__name__)
CORS(app)

# Initialize classifier
path_a = 'waste-detection-main/weights/best.pt'
path_b = 'Waste-Classification-using-YOLOv8-main/streamlit-detection-tracking - app/weights/yoloooo.pt'
classifier = CombinedClassifier(path_a, path_b)

@app.route('/api/classify', methods=['POST'])
def classify_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
        
    file = request.files['image']
    
    # Read image from file
    npimg = np.fromstring(file.read(), np.uint8)
    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    
    if frame is None:
        return jsonify({'error': 'Invalid image format'}), 400
        
    # Process
    detections = classifier.process_frame(frame)
    
    # Draw detections
    out_frame = classifier.draw_detections(frame.copy(), detections)
    
    # Encode output frame
    _, buffer = cv2.imencode('.jpg', out_frame)
    base64_image = base64.b64encode(buffer).decode('utf-8')
    
    # Send both detections and image
    return jsonify({
        'detections': detections,
        'image': f'data:image/jpeg;base64,{base64_image}'
    })

import json
import os

DB_FILE = 'db.json'

def load_db():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r') as f:
            try:
                return json.load(f)
            except:
                pass
    return {}

def save_db(data):
    with open(DB_FILE, 'w') as f:
        json.dump(data, f)

db_data = load_db()

@app.route('/db', methods=['GET'])
def get_all_db():
    return jsonify(db_data)

@app.route('/db/<key>.json', methods=['GET', 'PUT', 'POST', 'DELETE'])
def handle_db(key):
    global db_data
    if request.method == 'GET':
        return jsonify(db_data.get(key))
    elif request.method == 'PUT':
        db_data[key] = request.json
        save_db(db_data)
        return jsonify(db_data[key])
    elif request.method == 'POST':
        if key not in db_data or not isinstance(db_data[key], list):
            db_data[key] = []
        db_data[key].append(request.json)
        save_db(db_data)
        return jsonify(request.json)
    elif request.method == 'DELETE':
        if key in db_data:
            del db_data[key]
            save_db(db_data)
        return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
