#include <WiFi.h>
#include <HTTPClient.h>
#include "DHT.h"

// ================= WIFI =================
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// ================= FIREBASE =================
String firebaseURL = "https://espwebdash-da9ac-default-rtdb.asia-southeast1.firebasedatabase.app/latest_sensor.json";

// ================= PINS =================
#define DHTPIN 4
#define DHTTYPE DHT11

#define MQ4_PIN 34   // Analog pin for methane sensor

// ================= INIT =================
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);

  dht.begin();

  // Connect WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting");

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected!");
}

void loop() {

  if (WiFi.status() == WL_CONNECTED) {

    // -------- READ DHT11 --------
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    // -------- READ MQ-4 --------
    int methaneRaw = analogRead(MQ4_PIN);

    // -------- CHECK DHT --------
    if (isnan(temperature) || isnan(humidity)) {
      Serial.println("DHT11 Read Failed!");
      return;
    }

    // -------- PRINT --------
    Serial.println("------ DATA ------");
    Serial.print("Temp: "); Serial.println(temperature);
    Serial.print("Humidity: "); Serial.println(humidity);
    Serial.print("Methane Raw: "); Serial.println(methaneRaw);

    // -------- JSON --------
    String jsonData = "{";
    jsonData += "\"temperature_c\":" + String(temperature) + ",";
    jsonData += "\"humidity_pct\":" + String(humidity) + ",";
    jsonData += "\"methane_ppm\":" + String(methaneRaw) + ",";
    jsonData += "\"moisture_pct\":0";
    jsonData += "}";

    // -------- SEND --------
    HTTPClient http;

    http.begin(firebaseURL);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.PUT(jsonData);

    Serial.print("HTTP Response: ");
    Serial.println(httpResponseCode);

    http.end();
  }

  else {
    Serial.println("WiFi Disconnected!");
  }

  delay(5000);  // every 5 seconds
}