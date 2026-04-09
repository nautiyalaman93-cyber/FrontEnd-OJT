/**
 * @file Sidebar.jsx
 * @description The persistent side navigation bar.
 * Uses CSS custom properties from the BharatPath theme system —
 * automatically adapts between light (saffron accents) and dark mode.
 */

import { NavLink } from 'react-router-dom';
import {
  Home,
  MapPin,
  Ticket,
  BellRing,
  AlertTriangle,
  RefreshCcw,
  Route,
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard',           path: '/',                    icon: Home },
    { name: 'Live Tracking',       path: '/live-tracking',       icon: MapPin },
    { name: 'PNR Status',          path: '/pnr-status',          icon: Ticket },
    { name: 'Proximity Alerts',    path: '/proximity-alerts',    icon: BellRing },
    { name: 'Seat Exchange',       path: '/seat-exchange',       icon: RefreshCcw },
    { name: 'Connecting Journeys', path: '/connecting-journeys', icon: Route },
    { name: 'SOS Emergency',       path: '/sos',                 icon: AlertTriangle, isDanger: true },
  ];

  return (
    <aside
      style={{
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        color: 'var(--text-primary)',
      }}
      className="w-64 flex flex-col h-full overflow-y-auto z-20"
    >
      {/* Logo */}
      <div
        style={{ borderBottom: '1px solid var(--border-light)' }}
        className="p-6 flex items-center gap-3"
      >
        <div
          style={{
            background: 'var(--primary)',
            boxShadow: 'var(--shadow-primary)',
          }}
          className="p-2 rounded-xl"
        >
          <Route className="text-white" size={22} />
        </div>
        <h2
          style={{
            color: 'var(--primary)',
            fontFamily: "'Poppins', sans-serif",
          }}
          className="text-xl font-bold tracking-wide"
        >
          BharatPath
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5">
        <div
          style={{ color: 'var(--text-muted)' }}
          className="text-xs font-semibold uppercase tracking-wider mb-4 px-4 mt-2"
        >
          Main Menu
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={({ isActive }) =>
              isActive
                ? item.isDanger
                  ? {
                      background: 'var(--danger-bg)',
                      color: 'var(--danger)',
                      border: '1px solid var(--danger-border)',
                    }
                  : {
                      background: 'var(--primary)',
                      color: 'var(--text-inverse)',
                      boxShadow: 'var(--shadow-primary)',
                    }
                : {
                    color: 'var(--text-secondary)',
                    background: 'transparent',
                  }
            }
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                !isActive ? 'hover:bg-[var(--bg-hover)] hover:opacity-90' : ''
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={19}
                  style={{
                    color: isActive
                      ? 'inherit'
                      : item.isDanger
                      ? 'var(--danger)'
                      : 'var(--text-muted)',
                  }}
                />
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div
        style={{
          borderTop: '1px solid var(--border-light)',
          color: 'var(--text-muted)',
        }}
        className="p-6 text-xs text-center"
      >
        <p style={{ color: 'var(--text-secondary)' }} className="font-semibold mb-1">
          BharatPath App
        </p>
        <p>&copy; {new Date().getFullYear()} All rights reserved</p>
      </div>
    </aside>
  );
}
