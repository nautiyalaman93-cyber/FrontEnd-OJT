import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';

export default function MainLayout() {
  return (
    <>
      {/* ── Subtle background pattern overlay ── */}
      <div className="bp-bg-pattern" aria-hidden="true" />

      {/* ── Animated route lines (bonus decorative layer) ── */}
      <div className="bp-bg-pattern" aria-hidden="true">
        <div
          className="bp-route-line"
          style={{
            width: '300px',
            height: '2px',
            top: '18%',
            left: '-5%',
            animationDelay: '0s',
            animationDuration: '10s',
          }}
        />
        <div
          className="bp-route-line"
          style={{
            width: '200px',
            height: '2px',
            top: '55%',
            right: '5%',
            animationDelay: '3s',
            animationDuration: '13s',
          }}
        />
        <div
          className="bp-route-line"
          style={{
            width: '250px',
            height: '2px',
            top: '80%',
            left: '20%',
            animationDelay: '6s',
            animationDuration: '11s',
          }}
        />
      </div>

      <div
        style={{ background: 'var(--page-gradient)', color: 'var(--text-primary)' }}
        className="relative flex flex-col min-h-screen z-10"
      >
        <Topbar />

        {/* Main content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Outlet />
        </main>

        {/* Footer */}
        <footer
          style={{
            background: 'var(--bg-footer)',
            borderTop: '1px solid var(--border)',
            color: 'var(--text-muted)',
          }}
          className="w-full py-8 mt-12 shrink-0"
        >
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm font-medium">
            <p style={{ color: 'var(--text-secondary)' }}>
              &copy; 2026 BharatPath Advisory. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span
                style={{ color: 'var(--text-secondary)' }}
                className="cursor-pointer transition-opacity hover:opacity-60"
              >
                Support
              </span>
              <span
                style={{ color: 'var(--text-secondary)' }}
                className="cursor-pointer transition-opacity hover:opacity-60"
              >
                Terms of Service
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
