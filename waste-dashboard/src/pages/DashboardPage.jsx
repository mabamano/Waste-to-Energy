import React from 'react';
import KPICards from '../components/KPICards';
import SensorGauges from '../components/SensorGauges';
import { useTranslation } from '../contexts/LanguageContext';

export default function DashboardPage({ energyMetrics, dailySummary, latestSensor, energyHistory, summaryHistory }) {
  const { t } = useTranslation();
  
  return (
    <div className="page-content animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('page.dashboard.title')}</h1>
        <p className="page-subtitle">{t('page.dashboard.subtitle')}</p>
      </div>
      <div className="kpi-grid">
        <KPICards 
          energyMetrics={energyMetrics} 
          dailySummary={dailySummary} 
          energyHistory={energyHistory}
          summaryHistory={summaryHistory}
        />
      </div>
      <div className="gauges-section">
        <SensorGauges sensor={latestSensor} />
      </div>
    </div>
  );
}
