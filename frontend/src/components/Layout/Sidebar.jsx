import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon,
  BarChart3,
  Building2,
  Users,
  TrendingUp,
  Globe,
  DollarSign,
  Target,
  Activity,
  BookOpen,
  PieChart,
  Briefcase,
  FileText,
  ChevronDown,
  Settings,
  Shield,
  MessageCircle
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { label: 'Home', href: '/', icon: HomeIcon },
  { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { label: 'Sectors', href: '/sectors', icon: Target },
  { label: 'Companies', href: '/companies', icon: Building2 },
  { label: 'Investors', href: '/investors', icon: Users },
  { label: 'Transactions', href: '/transactions', icon: Activity },
  { label: 'Ecosystem', href: '/ecosystem', icon: Globe },
  { label: 'Investment', href: '/investment', icon: DollarSign },
  { label: 'Resources', href: '/curated-content', icon: BookOpen },
  { label: 'Contact', href: '/contact', icon: MessageCircle },
];

const ecosystemDropdown = [
  { label: 'Hubs', href: '/hubs', icon: Building2 },
  { label: 'Incubators', href: '/incubators', icon: Users },
  { label: 'Accelerators', href: '/accelerators', icon: TrendingUp },
  { label: 'Universities', href: '/universities', icon: BookOpen },
];

const transactionDropdown = [
  { label: 'All Transactions', href: '/transactions', icon: Activity },
  { label: 'Funding Rounds', href: '/funding', icon: TrendingUp },
  { label: 'Deal Analytics', href: '/transactions?view=analytics', icon: BarChart3 },
  { label: 'Investment Trends', href: '/transactions?view=trends', icon: PieChart },
];

const Sidebar = ({ collapsed = false }) => {
  const location = useLocation();
  const [ecoOpen, setEcoOpen] = useState(false);
  const [transOpen, setTransOpen] = useState(false);
  return (
    <aside className={collapsed ? `${styles.sidebar} ${styles.sidebarCollapsed}` : styles.sidebar}>
      <div className={styles.logoSection} style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: collapsed ? '1.2rem 0.5rem 1rem 0.5rem' : '1.2rem 1rem 1rem 1rem' }}>
        <img
          src="https://storage.googleapis.com/dealroom-ecosystems-production/ethiopia/logo.png"
          alt="Ethiopia startup community Logo"
          style={{ width: 52, height: 52, objectFit: 'contain', marginBottom: collapsed ? 0 : 4, borderRadius: 0, display: 'block', opacity: 0.9 }}
        />
        <span
          className={collapsed ? styles.hideText : ''}
          style={{ fontWeight: 500, fontSize: '0.8rem', color: '#4a5568', marginTop: 2, letterSpacing: 0, transition: 'opacity 0.2s, width 0.2s', textAlign: 'center', display: 'block' }}
        >
          Ethiopia Startup Community
        </span>
      </div>
      <nav className={styles.nav}>
        {navItems.map(({ label, href, icon }) => {
          if (label === 'Ecosystem') {
            return (
              <div key="Ecosystem" className={styles.navItem} style={{ flexDirection: 'column', paddingRight: 0 }}>
                <button
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600, color: '#2563eb', background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
                  onClick={() => setEcoOpen((v) => !v)}
                  aria-expanded={ecoOpen}
                >
                  {React.createElement(Globe, { size: 20, className: styles.navIcon })}
                  <span className={collapsed ? styles.hideText : ''}>Ecosystem</span>
                  {!collapsed && (
                    <span style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: ecoOpen ? 'rotate(180deg)' : 'none' }}>&#9660;</span>
                  )}
                </button>
                {ecoOpen && !collapsed && (
                  <div className={styles.ecosystemSubnav}>
                    {ecosystemDropdown.map(({ label, href, icon }) => (
                      <Link
                        key={label}
                        to={href}
                        className={
                          location.pathname === href || location.pathname.startsWith(href)
                            ? styles.active
                            : ''
                        }
                      >
                        {React.createElement(icon, { size: 18 })}
                        <span>{label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          } else if (label === 'Transactions') {
            return (
              <div key="Transactions" className={styles.navItem} style={{ flexDirection: 'column', paddingRight: 0 }}>
                <button
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 600, color: '#2563eb', background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}
                  onClick={() => setTransOpen((v) => !v)}
                  aria-expanded={transOpen}
                >
                  {React.createElement(Activity, { size: 20, className: styles.navIcon })}
                  <span className={collapsed ? styles.hideText : ''}>Transactions</span>
                  {!collapsed && (
                    <span style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: transOpen ? 'rotate(180deg)' : 'none' }}>&#9660;</span>
                  )}
                </button>
                {transOpen && !collapsed && (
                  <div className={styles.ecosystemSubnav}>
                    {transactionDropdown.map(({ label, href, icon }) => (
                      <Link
                        key={label}
                        to={href}
                        className={
                          location.pathname === href || location.pathname.startsWith(href)
                            ? styles.active
                            : ''
                        }
                      >
                        {React.createElement(icon, { size: 18 })}
                        <span>{label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          } else {
            // Resources and all other links are simple links
            return (
              <Link
                key={label}
                to={href}
                className={
                  location.pathname === href || (href !== '/' && location.pathname.startsWith(href))
                    ? `${styles.navItem} ${styles.active}`
                    : styles.navItem
                }
              >
                {React.createElement(icon, { size: 20, className: styles.navIcon })}
                <span className={collapsed ? styles.hideText : ''}>{label}</span>
              </Link>
            );
          }
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
