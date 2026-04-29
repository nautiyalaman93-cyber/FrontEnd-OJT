/**
 * @file index.jsx (PNR Status Page)
 * @description Theme-aware PNR page with entrance animations.
 */

import { useState } from 'react';
import { Search, CheckCircle, ArrowRight, RefreshCcw } from 'lucide-react';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

export default function PNRStatus() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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

      {/* ═══ Header Banner — Theme Aware ═══ */}
      <section className="relative overflow-hidden py-12 mb-10 anim-fade-in bp-hero-dark">
        {/* Ambient glow */}
        <div
          className="absolute top-[-30%] right-[-10%] w-[40%] h-[160%] rounded-full blur-[100px] pointer-events-none"
          style={{ background: isDark ? 'rgba(255,140,66,0.06)' : 'rgba(224,90,0,0.08)' }}
        />
        {!isDark && (
          <div
            className="absolute bottom-[-30%] left-[-10%] w-[50%] h-[160%] rounded-full blur-[120px] pointer-events-none"
            style={{ background: 'rgba(30,136,229,0.05)' }}
          />
        )}

        <div className="max-w-[1050px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="text-center md:text-left anim-slide-left">
            <div className="bp-section-label mb-3"><Search size={11} /> PNR Lookup</div>
            <h1
              className="text-2xl font-extrabold tracking-tight mb-1.5 flex items-center justify-center md:justify-start gap-2.5"
              style={{ color: isDark ? '#FFFFFF' : 'var(--text-heading)' }}
            >
              Check PNR Status
            </h1>
            <p className="text-[14px] font-medium" style={{ color: isDark ? '#CBD5E1' : 'var(--text-secondary)' }}>
              Live booking status, passenger info, and chart preparation.
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
          <div className="bp-card flex flex-col sm:flex-row items-center justify-between px-6 py-5">
            <div className="anim-slide-left">
              <div className="flex items-center gap-3 mb-1.5">
                <h2
                  className="text-[18px] font-bold"
                  style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
                >
                  {statusData.TrainNo || statusData.trainNumber} {statusData.TrainName || statusData.trainName}
                </h2>
                <span
                  className="text-[12px] font-bold px-2 py-0.5 rounded"
                  style={{ background: 'var(--bg-surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                >
                  {statusData.class || 'N/A'}
                </span>
              </div>
              <p
                className="text-[14px] font-medium flex items-center gap-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="w-0.5 h-4 rounded-full" style={{ background: 'var(--primary)' }} />
                {statusData.From || statusData.from} <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} /> {statusData.To || statusData.to}
              </p>
              <p className="text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
                Dept: {statusData.DepartureTime || statusData.departureTime || '--:--'} &nbsp;|&nbsp; Arr: {statusData.ArrivalTime || statusData.arrivalTime || '--:--'}
              </p>
            </div>
            <div
              className="flex items-center gap-2 mt-4 sm:mt-0 px-4 py-2 rounded-lg text-[14px] font-bold uppercase tracking-wide anim-scale-in anim-delay-2"
              style={{
                background: statusData.chartPrepared ? 'var(--success-bg)' : 'rgba(255,107,0,0.1)',
                color: statusData.chartPrepared ? 'var(--success)' : 'var(--primary)',
                border: `1px solid ${statusData.chartPrepared ? 'var(--success)' : 'var(--primary)'}`,
              }}
            >
              <CheckCircle size={16} />
              {statusData.chartPrepared ? 'Chart Prepared' : 'Chart Not Prepared'}
            </div>
          </div>

          {/* Passengers table */}
          <div className="bp-card overflow-hidden anim-fade-up anim-delay-2">
            <div
              className="px-5 py-3.5 border-b"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-surface-2)' }}
            >
              <h3 className="font-bold text-[15px]" style={{ color: 'var(--text-heading)' }}>
                Passenger Information ({statusData.passengers?.length || 0} passengers)
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
                    <th className="px-5 py-3 text-right">Coach / Seat / Berth</th>
                  </tr>
                </thead>
                <tbody>
                  {(statusData.passengers || []).map((p, i) => (
                    <tr
                      key={i}
                      className={`border-b last:border-0 transition-colors duration-200 anim-fade-up anim-delay-${Math.min(i + 3, 6)}`}
                      style={{ borderColor: 'var(--border-light)' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td className="px-5 py-4 flex items-center gap-2.5" style={{ color: 'var(--primary)' }}>
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}
                        >
                          {p.serialNo || i + 1}
                        </div>
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {p.name || `Passenger ${i + 1}`}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                        {p.BookingStatus || p.bookingStatus || '—'}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className="font-bold"
                          style={{ color: (p.CurrentStatus || p.currentStatus)?.startsWith('CNF') ? 'var(--success)' : (p.CurrentStatus || p.currentStatus)?.startsWith('WL') ? '#f97316' : 'var(--text-primary)' }}
                        >
                          {p.CurrentStatus || p.currentStatus || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-bold" style={{ color: 'var(--text-primary)' }}>
                        {(p.Coach || p.coach) && (p.BerthNo || p.seatNumber)
                          ? `${p.Coach || p.coach} | ${p.BerthNo || p.seatNumber}`
                          : (p.CurrentStatus || p.currentStatus)?.startsWith('WL') ? 'Waitlisted' : '—'}
                      </td>
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
