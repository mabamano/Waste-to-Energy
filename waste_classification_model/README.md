# Combined Waste Classification Project

This project unifies two YOLOv8 models to classify waste into three main categories:
- **Organic** (Food, Biodegradable, Stick)
- **Hazardous** (Batteries, Chemicals, Bulbs, Paint)
- **Recyclable** (Plastic, Paper, Metal, Glass, Cardboard)

## Project Structure

- `combined_classifier.py`: Main script to run waste classification using the default webcam (Index 0).
- `combined_classifier_cam2.py`: Script to run waste classification using a secondary webcam (Index 1).
- `requirements.txt`: Python dependencies.
- `waste-detection-main/`: Contains Model A (Specialized in Hazardous & specific items).
- `Waste-Classification-using-YOLOv8-main/`: Contains Model B (Specialized in General Waste types).

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   *Note: This requires Python installed.*

2. **Models**:
   Ensure the model weights are present in their respective directories:
   - `waste-detection-main/weights/best.pt`
   - `Waste-Classification-using-YOLOv8-main/streamlit-detection-tracking - app/weights/yoloooo.pt`

## Usage

**For Default Webcam:**
```bash
python combined_classifier.py
```

**For Secondary Webcam:**
```bash
python combined_classifier_cam2.py
```

The application will open a window showing the camera feed with bounding boxes and labels.
- **Green**: Organic
- **Red**: Hazardous
- **Blue**: Recyclable

Press `q` to quit the application.
