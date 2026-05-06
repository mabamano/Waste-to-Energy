import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Eye, Bell } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

const styles = {
  sidebar: {
    width: '260px',
    background: '#FFFFFF',
    borderRight: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  header: {
    padding: '28px 24px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logo: {
    width: '36px',
    height: '36px',
    background: '#EFF6FF',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3B82F6',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '-0.5px',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0F172A',
    letterSpacing: '-0.3px',
  },
  nav: {
    padding: '32px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    textDecoration: 'none',
    color: '#64748B',
    fontWeight: 500,
    fontSize: '14px',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
  },
  activeLink: {
    backgroundColor: '#EFF6FF',
    color: '#3B82F6',
    fontWeight: 600,
  },
  icon: {
    width: '18px',
    height: '18px',
  }
};

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.logo}>W2W</div>
        <div style={styles.title}>{t('app.title')}</div>
      </div>
      <nav style={styles.nav}>
        <NavLink 
          to="/" 
          style={({ isActive }) => isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink}
        >
          <LayoutDashboard style={styles.icon} />
          {t('nav.dashboard')}
        </NavLink>
        <NavLink 
          to="/analytics" 
          style={({ isActive }) => isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink}
        >
          <BarChart3 style={styles.icon} />
          {t('nav.analytics')}
        </NavLink>
        <NavLink 
          to="/vision" 
          style={({ isActive }) => isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink}
        >
          <Eye style={styles.icon} />
          {t('nav.vision')}
        </NavLink>
        <NavLink 
          to="/alerts" 
          style={({ isActive }) => isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink}
        >
          <Bell style={styles.icon} />
          {t('nav.alerts')}
        </NavLink>
      </nav>
    </aside>
  );
}
