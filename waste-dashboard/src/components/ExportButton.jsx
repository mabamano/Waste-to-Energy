import React from 'react';
import { Download } from 'lucide-react';
import { convertToCsv, todayString } from '../utils';
import { useTranslation } from '../contexts/LanguageContext';

const styles = {
  card: {
    padding: '24px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0F172A',
    marginBottom: '12px',
    letterSpacing: '-0.2px',
  },
  recordCount: {
    fontSize: '13px',
    color: '#64748B',
    marginBottom: '24px',
  },
  button: (disabled) => ({
    width: '100%',
    padding: '12px 20px',
    background: disabled ? '#F1F5F9' : '#3B82F6',
    color: disabled ? '#94A3B8' : '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  }),
};

export default function ExportButton({ historicalSensor }) {
  const { t } = useTranslation();
  const records = historicalSensor || [];
  const isEmpty = records.length === 0;

  const handleExport = () => {
    if (isEmpty) return;
    const csv = convertToCsv(records);
    const filename = `telemetry-log-${todayString()}.csv`;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="white-card" style={styles.card}>
      <div style={styles.title}>{t('export.title')}</div>
      <div style={styles.recordCount}>
        {isEmpty ? t('export.norecords') : `${records.length.toLocaleString()} ${t('export.records')}`}
      </div>
      <button
        style={styles.button(isEmpty)}
        onClick={handleExport}
        disabled={isEmpty}
        onMouseEnter={(e) => {
          if (!isEmpty) {
            e.currentTarget.style.background = '#2563EB'; // Darker blue
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isEmpty) {
            e.currentTarget.style.background = '#3B82F6';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      >
        <Download size={18} />
        {t('export.button')}
      </button>
    </div>
  );
}