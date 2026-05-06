import React, { memo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import { formatTime } from '../utils';
import { useTranslation } from '../contexts/LanguageContext';

const styles = {
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
  },
  card: {
    padding: '24px 20px 20px 20px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0F172A',
    marginBottom: '24px',
    paddingLeft: '4px',
    letterSpacing: '-0.2px',
  },
  empty: {
    height: '220px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94A3B8',
    fontSize: '14px',
  },
};

const tooltipStyle = {
  contentStyle: {
    background: '#FFFFFF',
    border: '1px solid #3B82F6',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.1)',
    padding: '12px 16px',
    color: '#1E293B',
    fontSize: '13px',
  },
  labelStyle: { color: '#64748B', fontWeight: 500, marginBottom: 8 },
};

const axisStyle = { stroke: '#CBD5E1', fontSize: 12, tickLine: false, color: '#64748B' };

const EmptyChart = ({ t }) => <div style={styles.empty}>{t('charts.nodata')}</div>;

const MethaneChart = ({ data, t }) => {
  if (!data?.length) return <div className="white-card" style={styles.card}><div style={styles.title}>{t('charts.methane')}</div><EmptyChart t={t} /></div>;
  return (
    <div className="white-card" style={styles.card}>
      <div style={styles.title}>{t('charts.methane')}</div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="timestamp" tickFormatter={formatTime} {...axisStyle} tick={{ fill: '#64748B' }} />
          <YAxis {...axisStyle} width={45} tick={{ fill: '#64748B' }} />
          <Tooltip {...tooltipStyle} labelFormatter={formatTime} formatter={(v) => [`${v} ppm`, t('sensors.methane')]} />
          <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8, color: '#64748B' }} />
          <ReferenceLine y={500} stroke="#EF4444" strokeDasharray="4 4" label={{ value: `${t('charts.warn')} 500`, fill: '#EF4444', fontSize: 11, position: 'insideTopRight' }} />
          <Line type="monotone" dataKey="methane_ppm" stroke="#3B82F6" strokeWidth={2.5} dot={false} name={t('sensors.methane')} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const TemperatureChart = ({ data, t }) => {
  if (!data?.length) return <div className="white-card" style={styles.card}><div style={styles.title}>{t('charts.temp')}</div><EmptyChart t={t} /></div>;
  return (
    <div className="white-card" style={styles.card}>
      <div style={styles.title}>{t('charts.temp')}</div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="timestamp" tickFormatter={formatTime} {...axisStyle} tick={{ fill: '#64748B' }} />
          <YAxis {...axisStyle} width={45} tick={{ fill: '#64748B' }} />
          <Tooltip {...tooltipStyle} labelFormatter={formatTime} formatter={(v) => [`${v} °C`, t('sensors.temp')]} />
          <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8, color: '#64748B' }} />
          <ReferenceLine y={50} stroke="#EF4444" strokeDasharray="4 4" label={{ value: `${t('charts.warn')} 50°C`, fill: '#EF4444', fontSize: 11, position: 'insideTopRight' }} />
          <Line type="monotone" dataKey="temperature_c" stroke="#8B5CF6" strokeWidth={2.5} dot={false} name={t('sensors.temp')} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const HumidityMoistureChart = ({ data, t }) => {
  if (!data?.length) return <div className="white-card" style={styles.card}><div style={styles.title}>{t('charts.env')}</div><EmptyChart t={t} /></div>;
  return (
    <div className="white-card" style={styles.card}>
      <div style={styles.title}>{t('charts.env')}</div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="timestamp" tickFormatter={formatTime} {...axisStyle} tick={{ fill: '#64748B' }} />
          <YAxis {...axisStyle} width={45} domain={[0, 100]} tick={{ fill: '#64748B' }} />
          <Tooltip {...tooltipStyle} labelFormatter={formatTime} formatter={(v) => [`${v}%`, '']} cursor={{ fill: '#F8FAFC' }} />
          <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8, color: '#64748B' }} />
          <Bar dataKey="humidity_pct" fill="#3B82F6" radius={[4, 4, 0, 0]} name={t('sensors.humidity')} />
          <Bar dataKey="moisture_pct" fill="#60A5FA" radius={[4, 4, 0, 0]} name={t('sensors.moisture')} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const HistoricalCharts = memo(({ history }) => {
  const { t } = useTranslation();
  return (
    <div style={styles.section}>
      <MethaneChart data={history} t={t} />
      <TemperatureChart data={history} t={t} />
      <HumidityMoistureChart data={history} t={t} />
    </div>
  );
});

export default HistoricalCharts;