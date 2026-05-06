import React from 'react';
import { formatDateTime } from '../utils';
import { useTranslation } from '../contexts/LanguageContext';

const styles = {
  card: {
    padding: '28px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0F172A',
    marginBottom: '24px',
    letterSpacing: '-0.2px',
  },
  empty: {
    fontSize: '14px',
    color: '#64748B',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '20px 0',
  },
  alertItem: (isCritical) => ({
    background: isCritical ? '#FEF2F2' : '#FFFBEB',
    border: `1px solid ${isCritical ? '#FECACA' : '#FEF3C7'}`,
    borderLeft: `4px solid ${isCritical ? '#EF4444' : '#F59E0B'}`,
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  alertContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  alertMessage: (isCritical) => ({
    fontSize: '15px',
    fontWeight: 600,
    color: isCritical ? '#B91C1C' : '#B45309',
  }),
  alertTime: {
    fontSize: '13px',
    color: '#64748B',
  },
  ackButton: {
    background: 'transparent',
    color: '#64748B',
    border: '1px solid #E2E8F0',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }
};

export default function AlertsPanel({ alerts, onAcknowledge }) {
  const { t } = useTranslation();

  if (!alerts || alerts.length === 0) {
    return (
      <div className="white-card" style={styles.card}>
        <div style={styles.title}>{t('alerts.title')}</div>
        <div style={styles.empty}>{t('alerts.empty')}</div>
      </div>
    );
  }

  return (
    <div className="white-card" style={styles.card}>
      <div style={styles.title}>{t('alerts.title')} ({alerts.length})</div>
      <div>
        {alerts.map((alert) => {
          const isCritical = alert.type === 'critical' || (alert.message && alert.message.toLowerCase().includes('critical'));
          
          return (
            <div key={alert.id} style={styles.alertItem(isCritical)}>
              <div style={styles.alertContent}>
                <div style={styles.alertMessage(isCritical)}>{alert.message || alert.type || t('alerts.unknown')}</div>
                <div style={styles.alertTime}>{alert.timestamp ? formatDateTime(alert.timestamp) : t('alerts.justnow')}</div>
              </div>
              <button
                style={styles.ackButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F1F5F9';
                  e.currentTarget.style.color = '#1E293B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#64748B';
                }}
                onClick={() => onAcknowledge(alert.id)}
              >
                {t('alerts.ack')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}