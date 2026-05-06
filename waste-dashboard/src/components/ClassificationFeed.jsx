import React, { useEffect, useState } from 'react';
import { formatDateTime } from '../utils';
import { useTranslation } from '../contexts/LanguageContext';

const styles = {
  card: {
    padding: '28px',
  },
  cardPulse: {
    padding: '28px',
    borderColor: '#3B82F6',
    boxShadow: '0 0 0 1px #3B82F6, 0 10px 24px rgba(0, 0, 0, 0.08)',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0F172A',
    marginBottom: '20px',
    letterSpacing: '-0.2px',
  },
  wasteType: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1E293B',
    marginBottom: '16px',
  },
  placeholder: {
    fontSize: '14px',
    color: '#94A3B8',
    fontStyle: 'italic',
    padding: '20px 0',
  },
  confidenceSection: {
    marginTop: '8px',
  },
  confidenceLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#64748B',
    marginBottom: '8px',
  },
  barTrack: {
    background: '#F1F5F9',
    borderRadius: '8px',
    height: '6px',
    overflow: 'hidden',
  },
  barFill: (color, width) => ({
    width: `${width}%`,
    height: '100%',
    background: color,
    borderRadius: '8px',
    transition: 'width 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
  }),
  timestamp: {
    fontSize: '12px',
    color: '#94A3B8',
    marginTop: '24px',
  },
};

export default function ClassificationFeed({ classification }) {
  const [pulse, setPulse] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (classification) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [classification]);

  if (!classification) {
    return (
      <div className="white-card" style={styles.card}>
        <div style={styles.title}>{t('vision.title')}</div>
        <div style={styles.placeholder}>{t('vision.waiting')}</div>
      </div>
    );
  }

  const { waste_type, confidence, timestamp } = classification;
  const confPct = confidence * 100;

  // Uses the requested Ex Machina color palette
  let confColor = '#10B981'; // Mint green
  if (confPct < 60) confColor = '#EF4444'; // Alert red
  else if (confPct < 85) confColor = '#3B82F6'; // Cool blue

  const cardStyle = {
    ...styles.card,
    ...(pulse ? styles.cardPulse : {}),
  };

  return (
    <div className="white-card" style={cardStyle}>
      <div style={styles.title}>{t('vision.title')}</div>
      <div style={styles.wasteType}>{waste_type ?? t('vision.unknown')}</div>
      <div style={styles.confidenceSection}>
        <div style={styles.confidenceLabel}>
          {t('vision.confidence')} <span style={{ color: confColor, fontWeight: 600 }}>{confPct.toFixed(1)}%</span>
        </div>
        <div style={styles.barTrack}>
          <div style={styles.barFill(confColor, confPct)} />
        </div>
      </div>
      <div style={styles.timestamp}>{formatDateTime(timestamp)}</div>
    </div>
  );
}