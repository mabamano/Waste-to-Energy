import React from 'react';
import AlertsPanel from '../components/AlertsPanel';
import { useTranslation } from '../contexts/LanguageContext';

export default function AlertsPage({ alerts, onAcknowledge }) {
  const { t } = useTranslation();

  return (
    <div className="page-content animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('page.alerts.title')}</h1>
        <p className="page-subtitle">{t('page.alerts.subtitle')}</p>
      </div>
      
      <div className="alerts-layout">
        <AlertsPanel alerts={alerts} onAcknowledge={onAcknowledge} />
      </div>
    </div>
  );
}
