import React from 'react';
import { clamp, getSeverity } from '../utils';
import { useTranslation } from '../contexts/LanguageContext';

const SEVERITY_COLORS = { normal: '#3B82F6', warning: '#8B5CF6', critical: '#EF4444' };

const styles = {
  card: {
    padding: '28px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0F172A',
    marginBottom: '32px',
    letterSpacing: '-0.2px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '32px',
  },
  gauge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  label: { 
    fontSize: '14px', 
    fontWeight: 500, 
    color: '#64748B',
  },
  unit: { 
    fontSize: '12px', 
    color: '#94A3B8',
  },
};

const GaugeArc = ({ value, max, color }) => {
  const radius = 44, cx = 60, cy = 60, strokeWidth = 8;
  const startAngle = 135, totalAngle = 270;
  const pct = clamp(value / max, 0, 1);
  const fillAngle = totalAngle * pct;

  const polarToCartesian = (angle) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };
  const describeArc = (start, end) => {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const track = describeArc(startAngle, startAngle + totalAngle);
  const fill = fillAngle > 0 ? describeArc(startAngle, startAngle + fillAngle) : null;

  return (
    <svg width="120" height="90" viewBox="0 0 120 90">
      <path d={track} fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth} strokeLinecap="round" />
      {fill && <path d={fill} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.4s' }} />}
      <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="700" fill="#1E293B">
        {value != null ? (Number.isInteger(value) ? value : value.toFixed(1)) : '—'}
      </text>
    </svg>
  );
};

const Gauge = ({ label, unit, value, max, warn, crit }) => {
  const severity = value != null && warn != null ? getSeverity(value, warn, crit ?? Infinity) : 'normal';
  const color = SEVERITY_COLORS[severity];
  return (
    <div style={styles.gauge}>
      <GaugeArc value={value ?? 0} max={max} color={color} />
      <div style={styles.label}>{label}</div>
      <div style={styles.unit}>{unit}</div>
    </div>
  );
};

export default function SensorGauges({ sensor }) {
  const { t } = useTranslation();

  return (
    <div className="white-card" style={styles.card}>
      <div style={styles.title}>{t('sensors.title')}</div>
      <div style={styles.grid}>
        <Gauge label={t('sensors.methane')} unit="ppm" value={sensor?.methane_ppm} max={1000} warn={500} crit={800} />
        <Gauge label={t('sensors.temp')} unit="°C" value={sensor?.temperature_c} max={100} warn={50} crit={70} />
        <Gauge label={t('sensors.humidity')} unit="%" value={sensor?.humidity_pct} max={100} />
        <Gauge label={t('sensors.moisture')} unit="%" value={sensor?.moisture_pct} max={100} />
      </div>
    </div>
  );
}