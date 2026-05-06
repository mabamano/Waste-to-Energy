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

export default function CarbonCreditEstimator({ co2OffsetKg }) {
  const { t } = useTranslation();
  const hasData = co2OffsetKg != null && !isNaN(co2OffsetKg);
  const credits = hasData ? calculateCarbonCredits(co2OffsetKg) : null;
  const value = credits != null ? estimateCreditValue(credits, RATE_PER_CREDIT) : null;

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
      <div style={styles.note}>{t('credits.note')}</div>
    </div>
  );
}