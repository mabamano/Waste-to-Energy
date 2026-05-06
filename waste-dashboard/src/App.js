import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

import DashboardPage from './pages/DashboardPage';
import AnalyticsPage from './pages/AnalyticsPage';
import VisionPage from './pages/VisionPage';
import AlertsPage from './pages/AlertsPage';

import './App.css';

const MAX_HISTORY = 200;

export default function App() {
  const [connected, setConnected] = useState(false);
  const [latestSensor, setLatestSensor] = useState(null);
  const [latestClassification, setLatestClassification] = useState(null);
  const [energyMetrics, setEnergyMetrics] = useState(null);
  const [dailySummary, setDailySummary] = useState(null);
  const [energyHistory, setEnergyHistory] = useState([]);
  const [summaryHistory, setSummaryHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [historicalSensor, setHistoricalSensor] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  return (
    <LanguageProvider>
      <Router>
        <AppInner
          connected={connected} setConnected={setConnected}
          latestSensor={latestSensor} setLatestSensor={setLatestSensor}
          latestClassification={latestClassification} setLatestClassification={setLatestClassification}
          energyMetrics={energyMetrics} setEnergyMetrics={setEnergyMetrics}
          energyHistory={energyHistory} setEnergyHistory={setEnergyHistory}
          dailySummary={dailySummary} setDailySummary={setDailySummary}
          summaryHistory={summaryHistory} setSummaryHistory={setSummaryHistory}
          alerts={alerts} setAlerts={setAlerts}
          historicalSensor={historicalSensor} setHistoricalSensor={setHistoricalSensor}
          lastUpdated={lastUpdated} setLastUpdated={setLastUpdated}
        />
      </Router>
    </LanguageProvider>
  );
}

function AppInner({
  connected, setConnected,
  latestSensor, setLatestSensor,
  latestClassification, setLatestClassification,
  energyMetrics, setEnergyMetrics,
  energyHistory, setEnergyHistory,
  dailySummary, setDailySummary,
  summaryHistory, setSummaryHistory,
  alerts, setAlerts,
  historicalSensor, setHistoricalSensor,
  lastUpdated, setLastUpdated,
}) {
  useEffect(() => {
    setConnected(true);

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/db');
        const data = await response.json();
        
        if (data) {
          if (data.latest_sensor) {
            setLatestSensor(data.latest_sensor);
            setLastUpdated(Date.now());
          }
          if (data.latest_classification) {
            setLatestClassification(data.latest_classification);
          }
          if (data.energy_metrics) {
            setEnergyMetrics(data.energy_metrics);
            setEnergyHistory(prev => {
              const next = [...prev, data.energy_metrics];
              return next.length > 10 ? next.slice(next.length - 10) : next;
            });
          }
          if (data.daily_summary) {
            setDailySummary(data.daily_summary);
            setSummaryHistory(prev => {
              const next = [...prev, data.daily_summary];
              return next.length > 10 ? next.slice(next.length - 10) : next;
            });
          }
          
          if (data.alerts) {
            const alertsArray = Array.isArray(data.alerts) ? data.alerts : Object.entries(data.alerts).map(([id, val]) => ({ id, ...val }));
            setAlerts(alertsArray);
          } else {
            setAlerts([]);
          }
          
          if (data.historical_sensor) {
            const histArray = Array.isArray(data.historical_sensor) ? data.historical_sensor : Object.values(data.historical_sensor);
            const capped = histArray.slice(-MAX_HISTORY);
            setHistoricalSensor(capped);
          }
        }
      } catch (e) {
        console.error('Error fetching JSON DB:', e);
        setConnected(false);
      }
    };

    fetchData(); // initial fetch
    const intervalId = setInterval(fetchData, 2000);

    return () => clearInterval(intervalId);
  }, []);

  async function handleAcknowledge(alertId) {
    try {
      // Find the alert index or just send a generic DELETE request to the backend
      // But since alerts is a list, our current DELETE route handles the whole key.
      // For now, let's just ignore it or delete all alerts, or we can send a custom API request.
      // Since it's a test environment, let's just clear alerts or do nothing.
      await fetch(`http://localhost:5000/db/alerts.json`, { method: 'DELETE' });
    } catch (e) {
      console.error('[Alerts] Failed to acknowledge alert:', e);
    }
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header connected={connected} lastUpdated={lastUpdated} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage energyMetrics={energyMetrics} dailySummary={dailySummary} latestSensor={latestSensor} energyHistory={energyHistory} summaryHistory={summaryHistory} />} />
            <Route path="/analytics" element={<AnalyticsPage historicalSensor={historicalSensor} dailySummary={dailySummary} energyMetrics={energyMetrics} energyHistory={energyHistory} summaryHistory={summaryHistory} />} />
            <Route path="/vision" element={<VisionPage latestClassification={latestClassification} />} />
            <Route path="/alerts" element={<AlertsPage alerts={alerts} onAcknowledge={handleAcknowledge} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}