import requests
import random
import time
from datetime import datetime

# 🔗 Your Firebase URL (IMPORTANT: include .json)
BASE_URL = "https://espwebdash-da9ac-default-rtdb.asia-southeast1.firebasedatabase.app"

def generate_sensor_data():
    return {
        "temperature_c": round(random.uniform(25, 40), 2),   # °C
        "humidity_pct": round(random.uniform(40, 90), 2),      # %
        "methane_ppm": random.randint(200, 800),               # ppm (simulated)
        "moisture_pct": random.randint(20, 80),                # %
        "timestamp": datetime.now().isoformat()
    }

def generate_energy_metrics():
    return {
        "biogas_m3": round(random.uniform(10, 50), 2),
        "kwh_generated": round(random.uniform(20, 100), 2),
        "co2_offset_kg": round(random.uniform(5, 30), 2)
    }

def generate_daily_summary():
    return {
        "waste_processed_kg": round(random.uniform(100, 500), 2)
    }

while True:
    try:
        sensor_data = generate_sensor_data()
        energy_metrics = generate_energy_metrics()
        daily_summary = generate_daily_summary()

        requests.put(f"{BASE_URL}/latest_sensor.json", json=sensor_data)
        requests.put(f"{BASE_URL}/energy_metrics.json", json=energy_metrics)
        requests.put(f"{BASE_URL}/daily_summary.json", json=daily_summary)

        print("Sent Sensor:", sensor_data)
        print("Sent Energy:", energy_metrics)
        print("Sent Summary:", daily_summary)
        print("-" * 50)

    except Exception as e:
        print("Error:", e)

    time.sleep(5)