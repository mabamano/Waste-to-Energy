import requests
import random
import time
from datetime import datetime

# 🔗 Your Firebase URL (IMPORTANT: include .json)
FIREBASE_URL = "https://espwebdash-da9ac-default-rtdb.asia-southeast1.firebasedatabase.app/sensorData.json"

def generate_sensor_data():
    data = {
        "temperature": round(random.uniform(25, 40), 2),   # °C
        "humidity": round(random.uniform(40, 90), 2),      # %
        "methane": random.randint(200, 800),               # ppm (simulated)
        "moisture": random.randint(20, 80),                # %
        "timestamp": datetime.now().isoformat()
    }
    return data

while True:
    try:
        sensor_data = generate_sensor_data()

        response = requests.put(FIREBASE_URL, json=sensor_data)

        print("Sent:", sensor_data)
        print("Status Code:", response.status_code)
        print("-" * 50)

    except Exception as e:
        print("Error:", e)

    time.sleep(5)