# Waste-to-Energy Monitoring Dashboard

A real-time React dashboard for monitoring a Waste-to-Energy (WtE) facility. Connects to Firebase Realtime Database to display live sensor readings, AI waste classification results, energy production KPIs, historical trend charts, and an alert management panel — all in a dark industrial UI optimized for desktop and mobile.

---

## Prerequisites

- **Node.js** 16 or higher (18+ recommended)
- **npm** 8 or higher
- A **Firebase project** with Realtime Database enabled

---

## Installation

```bash
cd waste-dashboard
npm install
```

---

## Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
2. In the left sidebar, click **Build → Realtime Database**.
3. Click **Create Database**, choose a region, and start in **test mode** (you'll lock it down later).
4. In **Project Settings → General → Your apps**, click the web icon (`</>`) to register a web app.
5. Copy the `firebaseConfig` object — you'll need these values for your `.env` file.

---

## Environment Setup

Copy the example environment file and fill in your Firebase credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
```

> **Never commit `.env` to version control.** It is already listed in `.gitignore` by default with Create React App.

---

## Firebase Database Structure

The dashboard expects the following paths in your Realtime Database:

```json
{
  "latest_sensor": {
    "timestamp": 1700000000000,
    "methane_ppm": 320,
    "temperature_c": 42.5,
    "humidity_pct": 65,
    "moisture_pct": 38
  },
  "latest_classification": {
    "waste_type": "Organic",
    "confidence": 87.3,
    "timestamp": 1700000000000
  },
  "energy_metrics": {
    "biogas_m3": 142.7,
    "kwh_generated": 58.4,
    "co2_offset_kg": 320.1
  },
  "daily_summary": {
    "date": "2024-01-15",
    "total_kwh": 58.4,
    "total_co2_offset": 320.1,
    "waste_processed_kg": 1250
  },
  "alerts": {
    "-NxABC123": {
      "type": "warning",
      "message": "Methane level elevated: 520 ppm",
      "timestamp": 1700000000000
    }
  },
  "historical_sensor": {
    "-NxDEF456": {
      "timestamp": 1699999900000,
      "methane_ppm": 310,
      "temperature_c": 41.0,
      "humidity_pct": 63,
      "moisture_pct": 37
    }
  }
}
```

---

## Firebase Security Rules

Lock down your database so the dashboard can only read data and delete alerts:

```json
{
  "rules": {
    ".read": true,
    ".write": false,
    "alerts": {
      "$alertId": {
        ".write": "!newData.exists()"
      }
    }
  }
}
```

> For production, restrict `.read` to authenticated users and use Firebase Authentication.

---

## Running the App

```bash
npm start
```

Opens at [http://localhost:3000](http://localhost:3000). The page hot-reloads on file changes.

---

## Building for Production

```bash
npm run build
```

Outputs optimized static files to the `build/` directory. Deploy to Firebase Hosting, Netlify, Vercel, or any static host.

---

## Feature Overview

| Panel | Description |
|---|---|
| **Header** | Facility name, Firebase connection status badge, last-updated timestamp |
| **KPI Cards** | Biogas produced (m³), Power generated (kWh), CO₂ offset (kg), Waste processed (kg) |
| **Sensor Gauges** | Live arc gauges for Methane, Temperature, Humidity, Moisture with color-coded severity |
| **AI Classification Feed** | Latest waste type classification with confidence bar and timestamp |
| **Historical Charts** | Methane trend, Temperature trend, Humidity & Moisture area chart |
| **Alerts Panel** | Active threshold alerts sorted by time, with one-click acknowledgement |
| **Carbon Credit Estimator** | Converts CO₂ offset to estimated carbon credits and USD value |
| **Export Button** | Downloads all historical sensor data as a CSV file |

---

## Troubleshooting

**"Firebase Not Configured" error banner**
- Make sure `.env` exists and all `REACT_APP_FIREBASE_*` variables are set.
- Restart the dev server after editing `.env` (`Ctrl+C` then `npm start`).

**Dashboard shows "—" for all values**
- Check that your Firebase Realtime Database URL is correct in `.env`.
- Verify the database has data at the expected paths (see Database Structure above).
- Open the browser console for Firebase error messages.

**"Disconnected" badge stays red**
- Firebase `.info/connected` only becomes `true` when the SDK establishes a WebSocket connection.
- Check your `REACT_APP_FIREBASE_DATABASE_URL` — it must be the full RTDB URL (not Firestore).
- Check browser network tab for WebSocket connection errors.

**Alerts not disappearing after acknowledge**
- Verify your Firebase Security Rules allow delete on `alerts/$alertId` (see Security Rules above).

**Charts are empty**
- The `historical_sensor` node must contain records. Push sensor readings to this path from your data pipeline.
- The dashboard caps display at the last 200 records.

**CSV export downloads an empty file**
- The export button is disabled when `historical_sensor` is empty. Populate the database first.
