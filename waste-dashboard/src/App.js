import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ref, onValue, remove } from 'firebase/database';
import { database } from './firebase';
import { snapshotToArray } from './utils';
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
  const [alerts, setAlerts] = useState([]);
  const [historicalSensor, setHistoricalSensor] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  if (!database) {
    return (
      <div style={{ background: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-fade-in hover-card" style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '16px',
          padding: '28px 32px',
          color: '#EF4444',
          textAlign: 'center',
          maxWidth: '480px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>!</div>
          <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Firebase Not Configured</div>
          <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
            Firebase failed to initialize. Please copy <code style={{ color: '#1E293B', fontWeight: 'bold' }}>.env.example</code> to{' '}
            <code style={{ color: '#1E293B', fontWeight: 'bold' }}>.env</code> and fill in your Firebase credentials, then restart the app.
          </div>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <AppInner
          connected={connected} setConnected={setConnected}
          latestSensor={latestSensor} setLatestSensor={setLatestSensor}
          latestClassification={latestClassification} setLatestClassification={setLatestClassification}
          energyMetrics={energyMetrics} setEnergyMetrics={setEnergyMetrics}
          dailySummary={dailySummary} setDailySummary={setDailySummary}
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
  dailySummary, setDailySummary,
  alerts, setAlerts,
  historicalSensor, setHistoricalSensor,
  lastUpdated, setLastUpdated,
}) {
  useEffect(() => {
    const unsubs = [];

    const connRef = ref(database, '.info/connected');
    unsubs.push(onValue(connRef, (snap) => {
      setConnected(snap.val() === true);
    }));

    const sensorRef = ref(database, 'latest_sensor');
    unsubs.push(onValue(sensorRef, (snap) => {
      const val = snap.val();
      setLatestSensor(val);
      if (val) setLastUpdated(Date.now());
    }));

    const classRef = ref(database, 'latest_classification');
    unsubs.push(onValue(classRef, (snap) => {
      setLatestClassification(snap.val());
    }));

    const energyRef = ref(database, 'energy_metrics');
    unsubs.push(onValue(energyRef, (snap) => {
      setEnergyMetrics(snap.val());
    }));

    const summaryRef = ref(database, 'daily_summary');
    unsubs.push(onValue(summaryRef, (snap) => {
      setDailySummary(snap.val());
    }));

    const alertsRef = ref(database, 'alerts');
    unsubs.push(onValue(alertsRef, (snap) => {
      const withIds = snap.val()
        ? Object.entries(snap.val()).map(([key, val]) => ({ id: key, ...val }))
        : [];
      setAlerts(withIds);
    }));

    const histRef = ref(database, 'historical_sensor');
    unsubs.push(onValue(histRef, (snap) => {
      const arr = snapshotToArray(snap.val());
      const capped = arr.slice(-MAX_HISTORY);
      setHistoricalSensor(capped);
    }));

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAcknowledge(alertId) {
    remove(ref(database, 'alerts/' + alertId)).catch((err) => {
      console.error('[Alerts] Failed to acknowledge alert:', err);
    });
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header connected={connected} lastUpdated={lastUpdated} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage energyMetrics={energyMetrics} dailySummary={dailySummary} latestSensor={latestSensor} />} />
            <Route path="/analytics" element={<AnalyticsPage historicalSensor={historicalSensor} dailySummary={dailySummary} energyMetrics={energyMetrics} />} />
            <Route path="/vision" element={<VisionPage latestClassification={latestClassification} />} />
            <Route path="/alerts" element={<AlertsPage alerts={alerts} onAcknowledge={handleAcknowledge} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}