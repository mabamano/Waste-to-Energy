import requests
import time

# 🔗 Your Firebase URL (READ endpoint)
FIREBASE_URL = "https://espwebdash-da9ac-default-rtdb.asia-southeast1.firebasedatabase.app/latest_sensor.json"


def fetch_data():
    try:
        response = requests.get(FIREBASE_URL)

        if response.status_code == 200:
            data = response.json()
            return data
        else:
            print("Error:", response.status_code)
            return None

    except Exception as e:
        print("Exception:", e)
        return None


while True:
    data = fetch_data()

    if data:
        print("\n📊 Live Sensor Data")
        print("-" * 30)

        # If using PUT (single object)
        if isinstance(data, dict) and "temperature_c" in data:
            print(f"🌡 Temperature : {data.get('temperature_c')} °C")
            print(f"💧 Humidity    : {data.get('humidity_pct')} %")
            print(f"🧪 Methane     : {data.get('methane_ppm')} ppm")
            print(f"🌱 Moisture    : {data.get('moisture_pct')} %")
            print(f"⏱ Timestamp   : {data.get('timestamp')}")

        # If using POST (multiple entries)
        else:
            print("Latest Entries:")
            for key, value in list(data.items())[-5:]:
                print(f"\n🔹 Entry ID: {key}")
                print(f"   Temp : {value.get('temperature_c')}")
                print(f"   Hum  : {value.get('humidity_pct')}")
                print(f"   Gas  : {value.get('methane_ppm')}")
                print(f"   Soil : {value.get('moisture_pct')}")
                print(f"   Time : {value.get('timestamp')}")

    else:
        print("No data found")

    time.sleep(5)
