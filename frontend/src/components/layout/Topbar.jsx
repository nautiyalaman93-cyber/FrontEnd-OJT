import { Link, useLocation } from 'react-router-dom';
import { Train, LogIn, LogOut, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Topbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isDark = theme === 'dark';

  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

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

        {/* ── Nav + Toggle + Auth ── */}
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

          <div className="flex items-center gap-4 border-l pl-4" style={{ borderColor: 'var(--border)' }}>
            {/* ── Theme Toggle ── */}
            <button
              id="theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              className={`theme-toggle ${isDark ? 'theme-toggle--active' : ''}`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="theme-toggle__track">
                <span className="theme-toggle__thumb" />
              </span>
            </button>

            {/* ── Auth Button ── */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>{user.name}</span>
                  <button onClick={logout} className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:underline">Logout</button>
                </div>
                {user.avatar ? (
                  <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border" style={{ borderColor: 'var(--border)' }} />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center border" style={{ borderColor: 'var(--border)' }}>
                    <User size={16} className="text-slate-500" />
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="bp-btn bp-btn--primary px-4 py-1.5 text-[12px] font-bold flex items-center gap-2"
              >
                <LogIn size={14} />
                LOGIN
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
