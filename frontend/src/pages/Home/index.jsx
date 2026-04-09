/**
 * @file index.jsx (Home Page)
 * @description BharatPath home — polished hero, animated feature cards, full theme support.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/ui/SearchBar';
import { api } from '../../services/api';
import { Target, Map, Activity, Clock, ArrowRight, FileText, Sparkles } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [trainResults, setTrainResults] = useState(null);

  const features = [
    {
      title: 'Live Train Status',
      desc: 'Get exact location and estimated delays instantly.',
      icon: Activity,
      iconColor: '#3B82F6',
      iconBg: 'rgba(59,130,246,0.12)',
      path: '/live-tracking',
    },
    {
      title: 'PNR Status Insight',
      desc: 'Check confirmation chances and current waitlist movement.',
      icon: FileText,
      iconColor: '#10B981',
      iconBg: 'rgba(16,185,129,0.12)',
      path: '/pnr-status',
    },
    {
      title: 'GPS Proximity Alarms',
      desc: 'Secure wake-up calls tied to live telemetry.',
      icon: Target,
      iconColor: 'var(--primary)',
      iconBg: 'var(--primary-glow)',
      path: '/proximity-alerts',
    },
    {
      title: 'Smart Connecting Routes',
      desc: 'Intelligent multi-train paths for waitlisted routes.',
      icon: Map,
      iconColor: '#8B5CF6',
      iconBg: 'rgba(139,92,246,0.12)',
      path: '/connecting-journeys',
    },
  ];

  const handleSearch = async (query) => {
    setIsSearching(true);
    setTrainResults(null);
    try {
      const results = await api.searchTrains(query.fromStation, query.toStation, query.journeyDate);
      setTrainResults(results);
    } catch (error) {
      console.error('Failed to fetch trains:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full pb-16 min-h-screen" style={{ background: 'var(--bg-page)' }}>

      {/* ═══ Hero Section ═══ */}
      <section
        className="w-full text-center pt-20 pb-44 relative overflow-hidden bp-particles"
        style={{
          background: 'linear-gradient(135deg, #020617 0%, #0B3D6B 45%, #1E3A8A 100%)',
        }}
      >
        {/* Ambient glows */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] rounded-full blur-[120px] pointer-events-none"
          style={{ background: 'rgba(255,107,0,0.06)' }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[150%] rounded-full blur-[100px] pointer-events-none"
          style={{ background: 'rgba(59,130,246,0.08)' }}
        />

        {/* Floating particles */}
        <div className="bp-particle bp-particle--1" />
        <div className="bp-particle bp-particle--2" />
        <div className="bp-particle bp-particle--3" />
        <div className="bp-particle bp-particle--4" />
        <div className="bp-particle bp-particle--5" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 mt-4">
          <div className="anim-fade-up">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[12px] font-semibold tracking-wide uppercase"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Sparkles size={13} />
              Intelligent Railway Dashboard
            </div>
          </div>

          <h1
            className="text-5xl md:text-6xl font-extrabold mb-5 tracking-tight leading-tight anim-fade-up anim-delay-1 bp-gradient-text"
            style={{
              fontFamily: "'Poppins', sans-serif",
              background: 'linear-gradient(135deg, #FFFFFF 0%, #FF8C42 40%, #58A6FF 70%, #FFFFFF 100%)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            BHARAT-PATH
          </h1>
          <p className="text-[16px] md:text-[18px] text-[#CBD5E1] font-medium tracking-wide max-w-2xl mx-auto leading-relaxed anim-fade-up anim-delay-2">
            Hyper-accurate IRCTC ticket analytics, live train telematics, and peer-to-peer berth connections in one intelligent dashboard.
          </p>
        </div>
      </section>

      {/* ═══ Search Bar overlay ═══ */}
      <section className="w-full max-w-[1050px] mx-auto px-4 -mt-24 relative z-20 anim-fade-up anim-delay-3">
        <div
          className="rounded-2xl anim-glow-pulse"
          style={{
            background: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)',
          }}
        >
          <SearchBar onSearch={handleSearch} isSearching={isSearching} />
        </div>
      </section>

      {/* ═══ Feature Cards (or train results) ═══ */}
      {trainResults ? (
        <section className="w-full max-w-[1050px] mx-auto mt-10 px-4 anim-fade-up">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-[18px] font-extrabold tracking-wide"
              style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
            >
              {trainResults.length} trains found
            </h2>
            <div
              className="text-[12px] font-bold px-3 py-1 rounded-full border"
              style={{
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                borderColor: 'var(--primary)',
              }}
            >
              Verified Route
            </div>
          </div>

          <div className="space-y-5">
            {trainResults.map((train, idx) => (
              <div
                key={idx}
                className={`bp-card overflow-hidden relative group anim-fade-up anim-delay-${idx + 1}`}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'var(--primary)' }}
                />

                <div
                  className="px-6 py-4 border-b flex items-center justify-between"
                  style={{ borderColor: 'var(--border-light)', background: 'var(--bg-surface-2)' }}
                >
                  <div className="flex items-center gap-3">
                    <h3
                      className="text-[17px] font-extrabold uppercase tracking-wide flex items-center gap-2"
                      style={{ color: 'var(--text-heading)' }}
                    >
                      {train.name}
                      <span
                        className="text-[13px] font-bold border px-2 py-0.5 rounded"
                        style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
                      >
                        #{train.id}
                      </span>
                    </h3>
                    <span
                      className="text-[11px] font-bold border px-2.5 py-0.5 rounded uppercase tracking-wider"
                      style={{ background: 'var(--secondary-light)', color: 'var(--secondary)', borderColor: 'var(--secondary)' }}
                    >
                      {train.type}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6 sm:gap-8">
                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-heading)' }}>{train.departure}</p>
                      <p className="text-[11px] font-bold uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>Departure</p>
                    </div>

                    <div className="flex flex-col items-center w-[120px]">
                      <p
                        className="text-[11px] font-bold mb-2 px-2 py-0.5 rounded-full flex items-center gap-1 border"
                        style={{ color: 'var(--text-secondary)', background: 'var(--bg-surface-2)', borderColor: 'var(--border)' }}
                      >
                        <Clock size={10} /> {train.duration}
                      </p>
                      <div className="w-full h-[2px] relative" style={{ background: 'var(--border)' }}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-1" style={{ background: 'var(--bg-card)' }}>
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--primary)', boxShadow: '0 0 8px var(--primary-glow)' }} />
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-heading)' }}>{train.arrival}</p>
                      <p className="text-[11px] font-bold uppercase tracking-wider mt-1" style={{ color: 'var(--text-muted)' }}>Arrival</p>
                    </div>
                  </div>

                  <button
                    className="bp-btn bp-btn--primary px-8 py-3 text-[14px] font-bold uppercase tracking-wider"
                    onClick={() => navigate('/live-tracking')}
                  >
                    Track Live
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="w-full max-w-[1050px] mx-auto mt-16 px-4 pb-16">
          <div className="flex items-center gap-3 mb-10 anim-fade-up">
            <div className="w-1.5 h-7 rounded-full" style={{ background: 'var(--primary)' }} />
            <h2
              className="text-[24px] font-extrabold tracking-wide"
              style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
            >
              Explore Features
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(feature.path)}
                  className={`bp-card p-6 cursor-pointer group flex flex-col h-full relative overflow-hidden anim-fade-up anim-delay-${idx + 1}`}
                >
                  {/* Hover gradient sweep */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at top right, ${feature.iconBg}, transparent 60%)`,
                    }}
                  />

                  {/* Icon */}
                  <div
                    className="bp-icon-box w-12 h-12 mb-5 relative z-10 anim-breathe"
                    style={{
                      background: feature.iconBg,
                      border: '1px solid var(--border-light)',
                      animationDelay: `${idx * 0.5}s`,
                    }}
                  >
                    <Icon size={22} color={feature.iconColor} />
                  </div>

                  <h3
                    className="text-[16px] font-bold mb-2 leading-snug relative z-10"
                    style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-[13px] font-medium leading-relaxed mb-6 flex-1 relative z-10"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {feature.desc}
                  </p>

                  <span
                    className="text-[12px] font-bold mt-auto uppercase tracking-widest relative z-10 flex items-center gap-1.5 group-hover:gap-3 transition-all duration-300"
                    style={{ color: 'var(--primary)' }}
                  >
                    Explore <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
