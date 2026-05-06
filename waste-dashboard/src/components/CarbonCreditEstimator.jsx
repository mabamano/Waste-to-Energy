import React from 'react';
import { calculateCarbonCredits, estimateCreditValue } from '../utils';
import { useTranslation } from '../contexts/LanguageContext';

const styles = {
  card: {
    padding: '24px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0F172A',
    marginBottom: '20px',
    letterSpacing: '-0.2px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '16px',
  },
  label: {
    fontSize: '14px',
    color: '#64748B',
    fontWeight: 500,
  },
  value: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#10B981', // Mint green
  },
  valueSmall: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#3B82F6', // Blue
  },
  divider: {
    height: '1px',
    background: '#E2E8F0',
    margin: '20px 0',
  },
  note: {
    fontSize: '12px',
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: '16px',
  },
};

const RATE_PER_CREDIT = 15;

export default function CarbonCreditEstimator({ co2OffsetKg, energyHistory }) {
  const { t } = useTranslation();
  const hasData = co2OffsetKg != null && !isNaN(co2OffsetKg);
  const credits = hasData ? calculateCarbonCredits(co2OffsetKg) : null;
  const value = credits != null ? estimateCreditValue(credits, RATE_PER_CREDIT) : null;

  function predictNextValue(history, key) {
    if (!history || history.length < 2) return null;
    const n = history.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    history.forEach((item, i) => {
      const x = i;
      const y = item[key] || 0;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });
    const denominator = n * sumXX - sumX * sumX;
    if (denominator === 0) return history[history.length - 1][key];
    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;
    return Math.max(0, slope * n + intercept);
  }

  const predCo2 = predictNextValue(energyHistory, 'co2_offset_kg');
  const predCredits = predCo2 != null ? calculateCarbonCredits(predCo2) : null;
  const predValue = predCredits != null ? estimateCreditValue(predCredits, RATE_PER_CREDIT) : null;

  return (
    <div className="white-card" style={styles.card}>
      <div style={styles.title}>{t('credits.title')}</div>
      <div style={styles.row}>
        <span style={styles.label}>{t('credits.offset')}</span>
        <span style={{ fontSize: '18px', fontWeight: 600, color: '#1E293B' }}>
          {hasData ? `${co2OffsetKg.toLocaleString()} kg` : '—'}
        </span>
      </div>
      <div style={styles.divider} />
      <div style={styles.row}>
        <span style={styles.label}>{t('credits.est_credits')}</span>
        <span style={styles.value}>{credits != null ? credits.toFixed(2) : '—'}</span>
      </div>
      <div style={styles.row}>
        <span style={styles.label}>{t('credits.est_value')}</span>
        <span style={styles.valueSmall}>{value != null ? `$${value.toFixed(2)}` : '—'}</span>
      </div>
      
      {predCredits != null && (
        <>
          <div style={styles.divider} />
          <div style={styles.row}>
            <span style={styles.label}>Predicted Next Credits</span>
            <span style={{ ...styles.valueSmall, color: '#8B5CF6' }}>{predCredits.toFixed(2)}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Predicted Value</span>
            <span style={{ ...styles.valueSmall, color: '#8B5CF6' }}>${predValue.toFixed(2)}</span>
          </div>
        </>
      )}

      <div style={styles.note}>{t('credits.note')}</div>
    </div>
  );
}