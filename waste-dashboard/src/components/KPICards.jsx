import React from 'react';
import { Flame, Zap, Leaf, Recycle } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  },
  card: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  iconWrapper: (color) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    color: color,
    background: `${color}1A`, // 10% opacity hex
  }),
  label: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#64748B',
  },
  value: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1E293B',
    lineHeight: 1.2,
    marginBottom: '4px',
  },
  unit: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#94A3B8',
    marginLeft: '6px',
  },
  footer: {
    fontSize: '12px',
    color: '#94A3B8',
    marginTop: '16px',
  },
};

const formatValue = (val) => (val == null ? '—' : typeof val === 'number' ? val.toLocaleString() : val);

const KpiCard = ({ label, value, unit, color, footer, icon: Icon }) => (
  <div className="white-card" style={styles.card}>
    <div style={styles.header}>
      <div style={styles.iconWrapper(color)}>
        <Icon size={18} />
      </div>
      <div style={styles.label}>{label}</div>
    </div>
    <div>
      <span style={styles.value}>{formatValue(value)}</span>
      {value != null && unit && <span style={styles.unit}>{unit}</span>}
    </div>
    {footer && <div style={styles.footer}>{footer}</div>}
  </div>
);

export default function KPICards({ energyMetrics, dailySummary }) {
  const { t } = useTranslation();

  return (
    <div style={styles.grid}>
      <KpiCard 
        label={t('kpi.biogas')}
        value={energyMetrics?.biogas_m3} 
        unit="m³" 
        color="#3B82F6" 
        footer={t('kpi.biogas.desc')}
        icon={Flame} 
      />
      <KpiCard 
        label={t('kpi.power')}
        value={energyMetrics?.kwh_generated} 
        unit="kWh" 
        color="#8B5CF6" 
        footer={t('kpi.power.desc')}
        icon={Zap} 
      />
      <KpiCard 
        label={t('kpi.co2')}
        value={energyMetrics?.co2_offset_kg} 
        unit="kg" 
        color="#10B981" 
        footer={t('kpi.co2.desc')}
        icon={Leaf} 
      />
      <KpiCard 
        label={t('kpi.waste')}
        value={dailySummary?.waste_processed_kg} 
        unit="kg" 
        color="#3B82F6" 
        footer={t('kpi.waste.desc')}
        icon={Recycle} 
      />
    </div>
  );
}