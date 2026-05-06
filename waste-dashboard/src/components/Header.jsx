import React from 'react';
import { formatDateTime } from '../utils';
import { useTranslation } from '../contexts/LanguageContext';

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 36px',
    background: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#0F172A',
    letterSpacing: '-0.2px',
  },
  rightArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginLeft: 'auto',
  },
  timestamp: {
    fontSize: '13px',
    color: '#64748B',
    fontFamily: "'Inter', sans-serif",
  },
  status: (connected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    background: connected ? '#ECFDF5' : '#FEF2F2',
    border: `1px solid ${connected ? '#A7F3D0' : '#FECACA'}`,
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 500,
    color: connected ? '#059669' : '#DC2626',
  }),
  dot: (connected) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: connected ? '#10B981' : '#EF4444',
  }),
  langButton: {
    background: '#F1F5F9',
    border: '1px solid #E2E8F0',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#3B82F6',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }
};

export default function Header({ connected, lastUpdated }) {
  const { t, language, toggleLanguage } = useTranslation();

  return (
    <header style={styles.header}>
      <div>
        <div style={styles.title}>{t('header.title')}</div>
      </div>
      <div style={styles.rightArea}>
        {lastUpdated && <div style={styles.timestamp}>{t('header.sync')} {formatDateTime(lastUpdated)}</div>}
        <div style={styles.status(connected)}>
          <div style={styles.dot(connected)} />
          {connected ? t('header.connected') : t('header.offline')}
        </div>
        <button 
          style={styles.langButton} 
          onClick={toggleLanguage}
          title="Switch Language"
        >
          {language === 'en' ? 'தமிழ்' : 'English'}
        </button>
      </div>
    </header>
  );
}