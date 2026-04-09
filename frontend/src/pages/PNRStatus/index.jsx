/**
 * @file index.jsx (PNR Status Page)
 * @description Theme-aware PNR page with entrance animations.
 */

import { useState } from 'react';
import { Search, User, CheckCircle, ArrowRight } from 'lucide-react';

import { api } from '../../services/api';

export default function PNRStatus() {
  const [pnr, setPnr] = useState('1234567890');
  const [isSearching, setIsSearching] = useState(false);
  const [statusData, setStatusData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setStatusData(null);
    try {
      const data = await api.getPNRStatus(pnr);
      setStatusData(data);
    } catch (error) {
      console.error("Failed to fetch PNR:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full pb-16 min-h-screen" style={{ background: 'var(--bg-page)' }}>

      {/* ═══ Header Banner ═══ */}
      <section
        className="relative overflow-hidden py-12 mb-10 anim-fade-in"
        style={{
          background: 'linear-gradient(135deg, #020617 0%, #0B3D6B 45%, #1E3A8A 100%)',
        }}
      >
        {/* Subtle glow */}
        <div
          className="absolute top-[-30%] right-[-10%] w-[40%] h-[160%] rounded-full blur-[100px] pointer-events-none"
          style={{ background: 'rgba(255,107,0,0.06)' }}
        />

        <div className="max-w-[1050px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="text-center md:text-left anim-slide-left">
            <h1
              className="text-2xl font-bold text-white tracking-wide mb-1.5 flex items-center justify-center md:justify-start gap-2.5"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <Search size={22} className="text-[#93C5FD]" />
              Check PNR Status
            </h1>
            <p className="text-[14px] text-[#CBD5E1] font-medium">
              Get accurate probability metrics and current tracking.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex items-stretch w-full sm:w-[480px] rounded-xl overflow-hidden anim-fade-up anim-delay-2"
            style={{
              background: 'var(--bg-surface)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border)',
              padding: '5px',
            }}
          >
            <div className="relative flex-1 flex items-center rounded-lg overflow-hidden" style={{ background: 'var(--bg-input)' }}>
              <div className="pl-4 pr-2 flex items-center pointer-events-none">
                <Search size={17} style={{ color: 'var(--text-muted)' }} />
              </div>
              <input
                type="text"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                placeholder="Enter 10 Digit PNR"
                className="w-full pr-4 py-3 bg-transparent focus:outline-none text-[15px] font-bold tracking-wider placeholder:font-normal"
                style={{ color: 'var(--text-primary)' }}
                required
                maxLength={10}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bp-btn bp-btn--primary ml-1.5 rounded-lg px-6 py-3 text-[14px] font-bold tracking-wide"
            >
              {isSearching ? 'Searching…' : 'SEARCH'}
            </button>
          </form>
        </div>
      </section>

      {/* ═══ Results ═══ */}
      {statusData && (
        <section className="max-w-[1000px] mx-auto px-4 space-y-6 anim-fade-up">

          {/* Train info card */}
          <div
            className="bp-card flex flex-col sm:flex-row items-center justify-between px-6 py-5"
          >
            <div className="anim-slide-left">
              <div className="flex items-center gap-3 mb-1.5">
                <h2
                  className="text-[18px] font-bold"
                  style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
                >
                  12952 Mumbai Rajdhani
                </h2>
                <span
                  className="text-[12px] font-bold px-2 py-0.5 rounded"
                  style={{ background: 'var(--bg-surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                >
                  AC 3-Tier
                </span>
              </div>
              <p
                className="text-[14px] font-medium flex items-center gap-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="w-0.5 h-4 rounded-full" style={{ background: 'var(--primary)' }} />
                NDLS (New Delhi) <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} /> MMCT (Mumbai Central)
              </p>
            </div>
            <div
              className="flex items-center gap-2 mt-4 sm:mt-0 px-4 py-2 rounded-lg text-[14px] font-bold uppercase tracking-wide anim-scale-in anim-delay-2"
              style={{
                background: 'var(--success-bg)',
                color: 'var(--success)',
                border: '1px solid var(--success)',
              }}
            >
              <CheckCircle size={16} style={{ color: 'var(--success)' }} />
              Chart Prepared
            </div>
          </div>

          {/* Passengers table */}
          <div className="bp-card overflow-hidden anim-fade-up anim-delay-2">
            <div
              className="px-5 py-3.5 border-b"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-surface-2)' }}
            >
              <h3 className="font-bold text-[15px]" style={{ color: 'var(--text-heading)' }}>
                Passenger Information
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className="text-[12px] uppercase font-bold tracking-wider border-b"
                    style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', background: 'var(--bg-surface-2)' }}
                  >
                    <th className="px-5 py-3">Passenger</th>
                    <th className="px-5 py-3 text-center">Booking</th>
                    <th className="px-5 py-3 text-center">Current</th>
                    <th className="px-5 py-3 text-right">Coach / Seat</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { book: 'CNF', check: 'CNF', location: 'B4 | 45 | Lower' },
                    { book: 'CNF', check: 'CNF', location: 'B4 | 46 | Middle' }
                  ].map((p, i) => (
                    <tr
                      key={i}
                      className={`border-b last:border-0 transition-colors duration-200 anim-fade-up anim-delay-${i + 3}`}
                      style={{ borderColor: 'var(--border-light)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="px-5 py-4 flex items-center gap-2.5" style={{ color: 'var(--primary)' }}>
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
                        >
                          {i + 1}
                        </div>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Passenger {i + 1}</span>
                      </td>
                      <td className="px-5 py-4 text-center" style={{ color: 'var(--text-secondary)' }}>{p.book}</td>
                      <td className="px-5 py-4 text-center">
                        <span className="font-bold" style={{ color: 'var(--success)' }}>{p.check}</span>
                      </td>
                      <td className="px-5 py-4 text-right font-bold" style={{ color: 'var(--text-primary)' }}>{p.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ═══ Empty state when no results ═══ */}
      {!statusData && (
        <div className="max-w-[500px] mx-auto text-center py-20 px-4 anim-fade-up anim-delay-3">
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--primary-light)', border: '1px solid var(--border)' }}
          >
            <Search size={28} style={{ color: 'var(--primary)' }} />
          </div>
          <h3
            className="text-lg font-bold mb-2"
            style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
          >
            Enter a PNR number to get started
          </h3>
          <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
            We'll show you the booking status, current seat allocation, and chart status for your journey.
          </p>
        </div>
      )}
    </div>
  );
}
