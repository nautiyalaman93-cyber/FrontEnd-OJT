/**
 * @file index.jsx (Home Page)
 * @description BharatPath — surgical precision, search-first layout. 
 * Human-crafted typography and layout. No fake numbers.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/ui/SearchBar';
import { api } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import {
  Target, Map, Activity, ArrowRight, FileText,
  Clock, Train, CheckCircle2, MapPin, Bell,
  Shield, ChevronRight, Zap
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isSearching, setIsSearching] = useState(false);
  const [trainResults, setTrainResults] = useState(() => {
    const saved = sessionStorage.getItem('lastTrainSearch');
    return saved ? JSON.parse(saved) : null;
  });

  const handleSearch = async (query) => {
    setIsSearching(true);
    setTrainResults(null);
    try {
      const results = await api.searchTrains(query.fromStation, query.toStation, query.journeyDate);
      setTrainResults(results);
      sessionStorage.setItem('lastTrainSearch', JSON.stringify(results));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const features = [
    { title: 'Live Telemetry', desc: 'Surgical accuracy for train locations and platform estimates.', icon: Activity, color: '#3B82F6', path: '/live-tracking', status: 'Operational' },
    { title: 'PNR Intelligence', desc: 'Predict confirmation chances and track chart preparation.', icon: FileText, color: '#10B981', path: '/pnr-status', status: 'Instant' },
    { title: 'Geo-Fencing', desc: 'Set smart alerts that trigger as you enter your destination radius.', icon: Target, color: 'var(--primary)', path: '/proximity-alerts', status: 'GPS-Synced' },
    { title: 'Peer Exchange', desc: 'Direct seat swap negotiations with verified co-passengers.', icon: Map, color: '#8B5CF6', path: '/seat-exchange', status: 'Verified' },
  ];

  return (
    <>
      <div className="bp-bg-pattern" />
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden opacity-50">
        <div className="bp-particle bp-particle--1" />
        <div className="bp-particle bp-particle--2" />
        <div className="bp-particle bp-particle--3" />
        <div className="bp-particle bp-particle--4" />
        <div className="bp-particle bp-particle--5" />
      </div>

      {/* ═══ COMPACT HERO — Surgical Layout ═══ */}
      <section
        className="w-full relative overflow-visible z-[60]"
        style={{
          background: isDark
            ? 'linear-gradient(160deg, #0a0a0a 0%, #050505 100%)'
            : 'linear-gradient(160deg, #FAF9F6 0%, #F3F2EE 100%)',
          borderBottom: `1px solid var(--border)`,
        }}
      >
        {/* Refined ambient glow */}
        <div
          className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: isDark ? 'rgba(255,122,0,0.03)' : 'rgba(217,81,0,0.04)',
            filter: 'blur(100px)',
          }}
        />

        <div className="max-w-[1100px] mx-auto px-6 pt-16 pb-0 relative z-10">

          {/* System Status Label */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] px-3 py-1.5 rounded-md"
              style={{ 
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', 
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)'
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10B981' }} />
              Network Live
            </div>
          </div>

          {/* Headline — High-end typography */}
          <h1
            className="text-[48px] md:text-[68px] font-extrabold leading-[0.95] mb-6 max-w-[800px] anim-slide-left"
            style={{
              color: 'var(--text-heading)',
              letterSpacing: '-0.05em',
            }}
          >
            Real-time <span className="bp-gradient-text">coordination</span> for the <span className="bp-glow-text" style={{ color: 'var(--primary)' }}>Indian traveler.</span>
          </h1>

          <p
            className="text-[16px] md:text-[18px] max-w-[540px] mb-10 leading-relaxed font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Surgical train tracking, PNR intelligence, and verified seat swaps. 
            Engineered for precision, designed for humans.
          </p>

          {/* Search bar — glass effect */}
          <div
            className="rounded-t-2xl overflow-visible translate-y-[1px] bp-glass anim-fade-up anim-delay-2"
            style={{
              borderBottom: 'none',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 50, // Higher than any subsequent content
            }}
          >
            <SearchBar onSearch={handleSearch} isSearching={isSearching} />
          </div>
        </div>
      </section>

      {/* ═══ Main Content Area ═══ */}
      <section className="w-full max-w-[1100px] mx-auto px-6 pt-12 pb-24">
        
        {trainResults ? (
          <div className="anim-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <span className="bp-section-label">Live Results</span>
              <span className="text-[14px] font-bold" style={{ color: 'var(--text-muted)' }}>
                {trainResults.length} matches found
              </span>
            </div>
            <div className="space-y-3">
              {trainResults.map((train, idx) => (
                <div key={idx} className="bp-card p-5 flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Robust mapping for different API structures */}
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[18px] font-bold" style={{ color: 'var(--text-heading)' }}>
                      {train.train_name || train.trainName || train.name || 'Unknown Train'}
                    </h3>
                    <span className="text-[12px] font-mono opacity-60" style={{ color: 'var(--text-secondary)' }}>
                      #{train.train_number || train.trainNumber || train.id || '-----'}
                    </span>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-center">
                      <div className="text-[20px] font-black" style={{ color: 'var(--text-heading)' }}>
                        {train.from_std || train.departure_time || train.departure || '--:--'}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-50" style={{ color: 'var(--text-muted)' }}>Departs</div>
                    </div>
                    <div className="w-12 h-px bg-border relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <div className="text-center">
                      <div className="text-[20px] font-black" style={{ color: 'var(--text-heading)' }}>
                        {train.to_std || train.arrival_time || train.arrival || '--:--'}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest font-bold opacity-50" style={{ color: 'var(--text-muted)' }}>Arrives</div>
                    </div>
                  </div>
                  <button onClick={() => navigate('/live-tracking')} className="bp-btn bp-btn--primary px-6 py-2.5 rounded-lg text-[13px] font-bold">
                    Live Status
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div 
                  key={i} 
                  onClick={() => navigate(f.path)}
                  className="bp-card p-6 group cursor-pointer hover:border-primary transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `${f.color}08`, border: `1px solid ${f.color}20` }}
                    >
                      <Icon size={22} color={f.color} />
                    </div>
                    <div 
                      className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded border"
                      style={{ color: f.color, borderColor: `${f.color}40`, background: `${f.color}08` }}
                    >
                      {f.status}
                    </div>
                  </div>
                  <h3 className="text-[18px] font-bold mb-2">{f.title}</h3>
                  <p className="text-[14px] leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                    {f.desc}
                  </p>
                  <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0" style={{ color: f.color }}>
                    Launch Module <ArrowRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Surgical Trust Footer */}
        <div className="mt-20 pt-12 border-t flex flex-col md:flex-row items-center justify-between gap-8" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-8 opacity-40">
            <Train size={20} />
            <Shield size={20} />
            <Zap size={20} />
          </div>
          <div className="text-[12px] font-medium tracking-tight" style={{ color: 'var(--text-muted)' }}>
            Proprietary Telemetry Engine · IRCTC Integrated · End-to-End Encryption
          </div>
        </div>
      </section>
    </>
  );
}
