import cv2
import sys
import time

try:
    from ultralytics import YOLO
except ImportError:
    print("Error: 'ultralytics' is not installed. Please install it using: pip install ultralytics")
    sys.exit(1)

class CombinedClassifier:
    def __init__(self, model_a_path, model_b_path):
        print("Loading models...")
        print(f"Loading Model A from {model_a_path}")
        self.model_a = YOLO(model_a_path)
        print(f"Loading Model B from {model_b_path}")
        self.model_b = YOLO(model_b_path)
        print("Models loaded successfully.")
        
        self.classes_a = self.model_a.names
        self.classes_b = self.model_b.names
        
        print("\nModel A Classes:", self.classes_a)
        print("Model B Classes:", self.classes_b)
        
        # Define Mappings
        # Goal Class: Organic, Hazardous, Recyclable
        
        # Model A Known Classes (from code):
        # RECYCLABLE = ['cardboard_box', 'can', 'plastic_bottle_cap', 'plastic_bottle', 'reuseable_paper']
        # NON_RECYCLABLE = ['plastic_bag', 'scrap_paper', 'stick', 'plastic_cup', 'snack_bag', 'plastic_box', 'straw', 'plastic_cup_lid', 'scrap_plastic', 'cardboard_bowl', 'plastic_cultery']
        # HAZARDOUS = ['battery', 'chemical_spray_can', 'chemical_plastic_bottle', 'chemical_plastic_gallon', 'light_bulb', 'paint_bucket']
        
        # Model B Known Classes (from README):
        # plastic, metal, paper, glass, cardboard, biodegradable
        
        self.mapping_rules = {}
        
        # Initialize mapping logic
        self.setup_mappings()

    def setup_mappings(self):
        # This function defines how we map raw class names to our 3 target categories
        # Target Categories: 'Organic', 'Hazardous', 'Recyclable'
        # Verification: 'Non-Recyclable' or 'Other' for things that don't fit.
        
        # Helper to normalize strings
        def norm(s): return s.lower().replace('_', ' ').strip()
        
        # Hazardous Items (mostly from Model A)
        self.hazardous_keywords = [
            'battery', 'chemical', 'paint', 'bulb', 'spray', 'toxic'
        ]
        
        # Organic Items (mostly from Model B)
        self.organic_keywords = [
            'biodegradable', 'organic', 'food', 'fruit', 'vegetable', 'stick'
        ]
        
        # Recyclable Items (Both models)
        self.recyclable_keywords = [
            'cardboard', 'paper', 'plastic', 'glass', 'metal', 'can', 'bottle'
        ]
    
    def classify_label(self, raw_label):
        label = raw_label.lower().replace('_', ' ')
        
        # Check Hazardous first (high priority)
        for k in self.hazardous_keywords:
            if k in label:
                return 'Hazardous'
        
        # Check Organic
        for k in self.organic_keywords:
            if k in label:
                return 'Organic'
                
        # Check Recyclable
        for k in self.recyclable_keywords:
            if k in label:
                # Exception: "plastic bag" is often considered non-recyclable in these datasets (Model A says so)
                # But user asked for Recyclable. 
                # Let's check if it's explicitly "disturbing" items.
                if 'plastic bag' in label or 'snack bag' in label:
                    return 'Non-Recyclable' # Or Other
                return 'Recyclable'
        
        return 'Non-Recyclable' # Default fallback

    def process_frame(self, frame):
        # Run inference
        # Using stream=True for efficiency or verbose=False
        results_a = self.model_a(frame, verbose=False, conf=0.4)
        results_b = self.model_b(frame, verbose=False, conf=0.4)
        
        final_detections = []
        
        # Helper to add detection
        def add_det(box_obj, source_name, class_map):
            cls_id = int(box_obj.cls[0])
            conf = float(box_obj.conf[0])
            raw_label = class_map[cls_id]
            
            category = self.classify_label(raw_label)
            
            x1, y1, x2, y2 = box_obj.xyxy[0]
            
            final_detections.append({
                'box': (int(x1), int(y1), int(x2), int(y2)),
                'conf': conf,
                'raw_label': raw_label,
                'category': category,
                'source': source_name
            })

        # Process Model A
        for r in results_a:
            for box in r.boxes:
                add_det(box, 'Model A', self.classes_a)

        # Process Model B
        for r in results_b:
            for box in r.boxes:
                add_det(box, 'Model B', self.classes_b)
                
        # Non-Maximum Suppression (Simple) could be added here if boxes overlap too much
        # For now, we show all.
                
        return final_detections

    def draw_detections(self, frame, detections):
        for det in detections:
            x1, y1, x2, y2 = det['box']
            category = det['category']
            raw_label = det['raw_label']
            conf = det['conf']
            
            # Color Scheme
            if category == 'Organic':
                color = (0, 255, 0) # Green
            elif category == 'Hazardous':
                color = (0, 0, 255) # Red
            elif category == 'Recyclable':
                color = (255, 0, 0) # Blue
            else:
                color = (128, 128, 128) # Gray for others
            
            # Draw Box
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            
            # Label
            label_text = f"{category}: {raw_label} ({conf:.2f})"
            
            # Text Background
            (w, h), _ = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 1)
            cv2.rectangle(frame, (x1, y1 - 25), (x1 + w, y1), color, -1)
            cv2.putText(frame, label_text, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
            
        return frame

def main():
    # Model Paths
    # Note: Using absolute paths or relative to current dir.
    # Adjust these if necessary.
    path_a = 'waste-detection-main/weights/best.pt'
    path_b = 'Waste-Classification-using-YOLOv8-main/streamlit-detection-tracking - app/weights/yoloooo.pt'
    
    print("Initializing Combined Waste Classifier (Webcam 2)...")
    print("Press 'q' to quit the application.")
    
    try:
        classifier = CombinedClassifier(path_a, path_b)
    except Exception as e:
        print(f"Error initializing models: {e}")
        print("Please check if model files exist at the specified paths.")
        return

    # Open Webcam 2 (Index 1)
    cap = cv2.VideoCapture(1)
    
    if not cap.isOpened():
        print("Error: Could not open webcam 2 (index 1). Trying index 0...")
        # Fallback optional? Or just fail.
        # cap = cv2.VideoCapture(0)
        # if not cap.isOpened():
        #    return

    # Framerate calculation
    prev_frame_time = 0
    new_frame_time = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame.")
            break
            
        # Process
        detections = classifier.process_frame(frame)
        
        # Draw
        out_frame = classifier.draw_detections(frame, detections)
        
        # FPS
        new_frame_time = time.time()
        fps = 1/(new_frame_time-prev_frame_time) if prev_frame_time > 0 else 0
        prev_frame_time = new_frame_time
        
        cv2.putText(out_frame, f"FPS: {int(fps)}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
        
        cv2.imshow('Combined Waste Classifier (Cam 2)', out_frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
            
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
