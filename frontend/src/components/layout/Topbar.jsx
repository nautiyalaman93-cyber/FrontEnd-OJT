import { Link, useLocation } from 'react-router-dom';
import { Train } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Topbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const links = [
    { path: '/',              label: 'Home' },
    { path: '/pnr-status',   label: 'PNR Status' },
    { path: '/live-tracking', label: 'Live Status' },
    { path: '/seat-exchange', label: 'Seat Swap' },
    { path: '/sos',           label: 'SOS' },
  ];

  return (
    <header
      style={{
        background: 'var(--bg-topbar)',
        borderBottom: '1px solid var(--border)',
      }}
      className="w-full sticky top-0 z-50"
    >
      <div className="max-w-[1100px] mx-auto px-4 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            style={{
              background: 'var(--primary)',
              boxShadow: 'var(--shadow-primary)',
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-105"
          >
            <Train size={18} />
          </div>
          <span
            style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
            className="text-[18px] font-bold tracking-tight"
          >
            BharatPath
          </span>
        </Link>

        {/* ── Nav + Toggle ── */}
        <div className="flex items-center gap-5">
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              const isSOS = link.path === '/sos';

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    color: isSOS
                      ? 'var(--danger)'
                      : isActive
                      ? 'var(--primary)'
                      : 'var(--text-secondary)',
                    borderBottom: isActive && !isSOS
                      ? '2.5px solid var(--primary)'
                      : '2.5px solid transparent',
                    paddingTop: '20px',
                    paddingBottom: '18px',
                    fontWeight: isActive ? '700' : '500',
                  }}
                  className={`text-[13.5px] uppercase tracking-wide transition-all duration-200 hover:opacity-75 ${!isActive ? 'bp-link-underline' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Animated Theme Toggle ── */}
          <button
            id="theme-toggle-btn"
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`theme-toggle ${isDark ? 'theme-toggle--active' : ''}`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {/* Sun icon (visible when dark → clicking switches to light) */}
            <span
              className="theme-toggle__icon"
              style={{ opacity: isDark ? 0.4 : 1, fontSize: '15px' }}
              aria-hidden="true"
            >
              ☀️
            </span>

            {/* The pill track + sliding thumb */}
            <span className="theme-toggle__track" aria-hidden="true">
              <span className="theme-toggle__thumb" />
            </span>

            {/* Moon icon */}
            <span
              className="theme-toggle__icon"
              style={{ opacity: isDark ? 1 : 0.4, fontSize: '15px' }}
              aria-hidden="true"
            >
              🌙
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
