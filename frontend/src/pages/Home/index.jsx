/**
 * @file index.jsx (Home Page)
 * @description BharatPath — compact, search-first layout. Inspired by Ixigo/Cleartrip.
 * NO massive centered hero. Search is the star. Human-feeling layout.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/ui/SearchBar';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import {
  Target, Map, Activity, ArrowRight, FileText,
  Clock, Train, CheckCircle2, MapPin, Bell,
  TrendingUp, Users, Shield, ChevronRight,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isSearching, setIsSearching] = useState(false);
  const [trainResults, setTrainResults] = useState(null);

  const handleSearch = async (query) => {
    setIsSearching(true);
    setTrainResults(null);
    try {
      const results = await api.searchTrains(query.fromStation, query.toStation, query.journeyDate);
      setTrainResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const features = [
    { title: 'Live Train Status', desc: 'Real-time location, delay alerts, and platform info.', icon: Activity, color: '#3B82F6', path: '/live-tracking', stat: 'Updated every 30s' },
    { title: 'PNR Status', desc: 'Booking confirmation, chart status, and waitlist tracking.', icon: FileText, color: '#10B981', path: '/pnr-status', stat: 'Instant results' },
    { title: 'Proximity Alarm', desc: 'Auto wake-up as you approach your destination station.', icon: Target, color: 'var(--primary)', path: '/proximity-alerts', stat: 'GPS-based' },
    { title: 'Seat Exchange', desc: 'Swap berths with co-passengers. Verified via PNR & location.', icon: Map, color: '#8B5CF6', path: '/seat-exchange', stat: 'P2P verified' },
  ];

  return (
    <div className="w-full min-h-screen" style={{ background: 'var(--bg-page)' }}>

      {/* ═══ COMPACT HERO — Search First ═══ */}
      <section
        className="w-full relative"
        style={{
          background: isDark
            ? 'linear-gradient(160deg, #1a0e04 0%, #0a0907 60%)'
            : 'linear-gradient(160deg, #FFF8F2 0%, #FFF0E4 40%, #F5EFE8 100%)',
          borderBottom: `1px solid ${isDark ? 'rgba(255,140,66,0.10)' : 'rgba(224,90,0,0.12)'}`,
        }}
      >
        {/* Subtle glow blob */}
        <div
          className="absolute top-0 right-[15%] w-[400px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: isDark ? 'rgba(255,140,66,0.04)' : 'rgba(224,90,0,0.06)',
            filter: 'blur(80px)',
          }}
        />

        <div className="max-w-[1100px] mx-auto px-5 pt-10 pb-0 relative z-10">

          {/* Top label */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full"
              style={{ background: isDark ? 'rgba(255,140,66,0.10)' : 'rgba(224,90,0,0.08)', color: 'var(--primary)', border: '1px solid rgba(224,90,0,0.20)' }}
            >
              <Train size={11} />
              Indian Railways Tracker
            </div>
          </div>

          {/* Headline — left aligned, natural size, NOT all caps */}
          <h1
            className="text-[36px] md:text-[44px] font-extrabold leading-[1.15] mb-3 max-w-[580px]"
            style={{
              fontFamily: "'Poppins', sans-serif",
              color: isDark ? '#F0E8DF' : '#0F0D0B',
              letterSpacing: '-0.5px',
            }}
          >
            Track trains, check PNR,
            <br />
            <span style={{ color: 'var(--primary)' }}>swap seats</span> — instantly.
          </h1>

          <p
            className="text-[15px] max-w-[480px] mb-6 leading-relaxed"
            style={{ color: isDark ? 'rgba(232,221,212,0.60)' : 'var(--text-secondary)' }}
          >
            The only railway dashboard you'll ever need. Live status, PNR checks, GPS alarms, and P2P seat swaps in one place.
          </p>

          {/* Inline quick links */}
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            {[
              { label: 'PNR Status', path: '/pnr-status', icon: FileText },
              { label: 'Live Tracking', path: '/live-tracking', icon: MapPin },
              { label: 'Proximity Alarm', path: '/proximity-alerts', icon: Bell },
            ].map((l) => {
              const Icon = l.icon;
              return (
                <button
                  key={l.path}
                  onClick={() => navigate(l.path)}
                  className="flex items-center gap-1.5 text-[13px] font-semibold transition-all duration-200 hover:opacity-80"
                  style={{ color: isDark ? 'rgba(232,221,212,0.70)' : 'var(--text-secondary)' }}
                >
                  <Icon size={13} style={{ color: 'var(--primary)' }} />
                  {l.label}
                  <ChevronRight size={12} />
                </button>
              );
            })}
          </div>

          {/* Search bar — flush with hero bottom */}
          <div
            className="rounded-t-2xl overflow-visible"
            style={{
              background: 'var(--bg-surface)',
              boxShadow: isDark
                ? '0 -4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,140,66,0.08)'
                : '0 -4px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(224,90,0,0.06)',
            }}
          >
            <SearchBar onSearch={handleSearch} isSearching={isSearching} />
          </div>
        </div>
      </section>

      {/* ═══ Results Section ═══ */}
      {trainResults && (
        <section className="w-full max-w-[1100px] mx-auto px-5 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="bp-section-label"><CheckCircle2 size={11} /> Search Results</span>
            <span className="text-[16px] font-bold" style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}>
              {trainResults.length} trains found
            </span>
          </div>

          <div className="space-y-3">
            {trainResults.map((train, idx) => (
              <div key={idx} className={`bp-card overflow-hidden relative group anim-fade-up anim-delay-${Math.min(idx+1,6)}`}>
                <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: 'linear-gradient(180deg, var(--primary), transparent)' }} />

                <div className="px-5 py-3 border-b flex items-center gap-3" style={{ borderColor: 'var(--border-light)', background: 'var(--bg-surface-2)' }}>
                  <span className="text-[15px] font-extrabold" style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}>
                    {train.name || train.trainName}
                  </span>
                  <span className="text-[12px] font-mono font-bold px-2 py-0.5 rounded" style={{ color: 'var(--text-muted)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    #{train.id || train.trainNumber}
                  </span>
                </div>

                <div className="px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="text-[22px] font-extrabold" style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}>{train.departure}</p>
                      <p className="text-[11px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>Departs</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <p className="text-[11px] font-semibold flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={10} /> {train.duration}
                      </p>
                      <div className="w-[80px] h-[1px] relative" style={{ background: 'var(--border)' }}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)', boxShadow: '0 0 4px var(--primary-glow)' }} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[22px] font-extrabold" style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}>{train.arrival}</p>
                      <p className="text-[11px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>Arrives</p>
                    </div>
                  </div>
                  <button
                    className="bp-btn bp-btn--primary text-[13px] font-bold"
                    style={{ padding: '9px 22px', borderRadius: '10px' }}
                    onClick={() => navigate('/live-tracking')}
                  >
                    Track Live <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ Feature Cards ═══ */}
      {!trainResults && (
        <section className="w-full max-w-[1100px] mx-auto px-5 pt-10 pb-16">

          {/* Trust strip */}
          <div className="flex items-center gap-6 flex-wrap mb-10 pb-8" style={{ borderBottom: '1px solid var(--border-light)' }}>
            {[
              { icon: TrendingUp, label: '1.2M+ PNR checks done' },
              { icon: Train,      label: 'Covers 8,000+ trains' },
              { icon: Users,      label: '45K+ active travelers' },
              { icon: Shield,     label: 'PNR & GPS verified swaps' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex items-center gap-2 text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  <Icon size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  {s.label}
                </div>
              );
            })}
          </div>

          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-[20px] font-bold"
              style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
            >
              What you can do with BharatPath
            </h2>
          </div>

          {/* 2-column grid (feels more human than 4 equal columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(f.path)}
                  className={`bp-card cursor-pointer group flex items-start gap-4 p-5 anim-fade-up anim-delay-${idx + 1}`}
                  style={{ overflow: 'visible' }}
                >
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
                    style={{ background: `${f.color}14`, border: `1px solid ${f.color}28` }}
                  >
                    <Icon size={18} color={f.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3
                        className="text-[15px] font-bold"
                        style={{ color: 'var(--text-heading)', fontFamily: "'Inter', sans-serif" }}
                      >
                        {f.title}
                      </h3>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: `${f.color}14`, color: f.color, border: `1px solid ${f.color}30` }}
                      >
                        {f.stat}
                      </span>
                    </div>
                    <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {f.desc}
                    </p>
                    <span
                      className="inline-flex items-center gap-1 text-[12px] font-semibold mt-3 group-hover:gap-2 transition-all duration-200"
                      style={{ color: f.color }}
                    >
                      Open <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
