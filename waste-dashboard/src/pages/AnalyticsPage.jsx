import React from 'react';
import HistoricalCharts from '../components/HistoricalCharts';
import CarbonCreditEstimator from '../components/CarbonCreditEstimator';
import ExportButton from '../components/ExportButton';
import { useTranslation } from '../contexts/LanguageContext';

export default function AnalyticsPage({ historicalSensor, dailySummary, energyMetrics }) {
  const { t } = useTranslation();

  return (
    <div className="page-content animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('page.analytics.title')}</h1>
        <p className="page-subtitle">{t('page.analytics.subtitle')}</p>
      </div>
      
      <div className="analytics-layout">
        <div className="charts-main">
          <HistoricalCharts history={historicalSensor} />
        </div>
        <div className="analytics-sidebar">
          <CarbonCreditEstimator co2OffsetKg={energyMetrics?.co2_offset_kg ?? null} />
          <ExportButton historicalSensor={historicalSensor} />
        </div>
      </div>
    </div>
  );
}
