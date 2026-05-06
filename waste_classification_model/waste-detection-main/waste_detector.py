from ultralytics import YOLO
import pathlib

class WasteDetector:
    # Waste categories definition
    RECYCLABLE = [
        'cardboard_box', 'can', 'plastic_bottle_cap', 'plastic_bottle', 'reuseable_paper'
    ]
    NON_RECYCLABLE = [
        'plastic_bag', 'scrap_paper', 'stick', 'plastic_cup', 'snack_bag', 
        'plastic_box', 'straw', 'plastic_cup_lid', 'scrap_plastic', 
        'cardboard_bowl', 'plastic_cultery'
    ]
    HAZARDOUS = [
        'battery', 'chemical_spray_can', 'chemical_plastic_bottle', 
        'chemical_plastic_gallon', 'light_bulb', 'paint_bucket'
    ]

    def __init__(self, model_path):
        """
        Initialize the WasteDetector with a given YOLO model path.
        """
        self.model = YOLO(model_path)
        self.names = self.model.names

    def predict(self, image, conf=0.6):
        """
        Run inference on the given image.
        Returns the raw YOLO results.
        """
        return self.model.predict(image, conf=conf)

    def classify_waste(self, detected_items):
        """
        Classify a set/list of detected item names into waste categories.
        Returns: (recyclable_items, non_recyclable_items, hazardous_items) as sets.
        """
        detected_set = set(detected_items)
        
        recyclable_items = detected_set & set(self.RECYCLABLE)
        non_recyclable_items = detected_set & set(self.NON_RECYCLABLE)
        hazardous_items = detected_set & set(self.HAZARDOUS)
        
        return recyclable_items, non_recyclable_items, hazardous_items

    def detect_and_classify(self, image, conf=0.6):
        """
        Perform detection on an image and return both the raw results and the classified waste types.
        
        Returns:
            results: The raw YOLO results object (list).
            classification: A dictionary containing sets of 'recyclable', 'non_recyclable', and 'hazardous' items found.
        """
        results = self.predict(image, conf=conf)
        detected_names = set()

        # Extract class names from results
        for result in results:
            detected_names.update([self.names[int(c)] for c in result.boxes.cls])

        recyclable, non_recyclable, hazardous = self.classify_waste(detected_names)

        classification = {
            "recyclable": recyclable,
            "non_recyclable": non_recyclable,
            "hazardous": hazardous,
            "all_detected": detected_names
        }

        return results, classification

    @staticmethod
    def format_class_name(class_name):
        """
        Utility to format class names (e.g., replaces underscores with spaces).
        """
        return class_name.replace("_", " ")
