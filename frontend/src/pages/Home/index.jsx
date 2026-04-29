import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Train, 
  MapPin, 
  Search, 
  Shield, 
  Zap, 
  Clock, 
  ArrowRight,
  Navigation,
  Activity,
  History,
  MessageSquare
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import SearchBar from '../../components/ui/SearchBar';
import { api } from '../../services/api';

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
    { title: 'Seat Exchange', desc: 'P2P platform to swap your middle seat for a window or aisle with fellow travelers.', icon: ArrowRight, color: '#FF6B00', path: '/seat-exchange' },
    { title: 'Live Tracking', desc: 'Millisecond-perfect GPS telemetry for every train in the Indian Railways network.', icon: Navigation, color: '#10B981', path: '/live-tracking' },
    { title: 'Proximity Alerts', desc: 'Never miss your station. Get smart geofenced alerts as you approach your destination.', icon: Activity, color: '#3B82F6', path: '/proximity-alerts' },
    { title: 'PNR Status', desc: 'Instant booking verification with AI-powered confirmation probability.', icon: History, color: '#8B5CF6', path: '/pnr-status' },
  ];

  return (
    <>
      {/* ═══ AMBIENT BACKGROUND EFFECTS ═══ */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[80%] rounded-full blur-[120px]" 
          style={{ background: isDark ? 'rgba(255,107,0,0.08)' : 'rgba(255,107,0,0.05)' }} />
        <div className="absolute bottom-0 left-[-10%] w-[50%] h-[70%] rounded-full blur-[100px]"
          style={{ background: isDark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.03)' }} />
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
        <div className="max-w-[1100px] mx-auto px-6 pt-16 pb-20">
          <div className="flex flex-col items-center text-center mb-12 anim-fade-up">
            <div className="bp-section-label mb-4">
              <Zap size={11} className="text-primary" /> Tomorrow's Railway Experience
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}>
              Bharat<span className="text-primary">Path</span>
            </h1>
            <p className="text-[15px] max-w-[600px] font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              A high-precision telemetry and social utility platform for the modern Indian traveler. 
              Real-time tracking, seat swapping, and geofenced alerts in one premium interface.
            </p>
          </div>

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

      {/* ═══ MAIN CONTENT AREA ═══ */}
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
                <div
                  key={idx}
                  className="bp-card p-5 flex flex-col md:flex-row items-center justify-between gap-6 hover-lift group relative overflow-hidden anim-fade-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Premium Glass Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  
                  {/* Robust mapping for different API structures */}
                  <div className="flex-1 min-w-0 relative z-10">
                    <h3 className="text-[17px] font-extrabold truncate" style={{ color: 'var(--text-heading)' }}>
                      {train.train_name || train.trainName || train.name || 'Unknown Train'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {train.train_number || train.trainNumber || train.id || '-----'}
                      </span>
                      <span className="text-[11px] font-medium opacity-50" style={{ color: 'var(--text-muted)' }}>
                        {train.running_days || 'Daily'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 min-w-[240px] justify-center">
                    <div className="text-center w-20">
                      <div className="text-[18px] font-black tabular-nums" style={{ color: 'var(--text-heading)' }}>
                        {train.from_std || train.departure_time || train.departure || '--:--'}
                      </div>
                      <div className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-40 mt-0.5" style={{ color: 'var(--text-muted)' }}>Departs</div>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center gap-1 opacity-20">
                       <div className="w-full h-[1px] bg-current" style={{ color: 'var(--text-muted)' }} />
                       <div className="text-[8px] font-bold uppercase tracking-tighter">{train.duration || '--h --m'}</div>
                    </div>

                    <div className="text-center w-20">
                      <div className="text-[18px] font-black tabular-nums" style={{ color: 'var(--text-heading)' }}>
                        {train.to_std || train.arrival_time || train.arrival || '--:--'}
                      </div>
                      <div className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-40 mt-0.5" style={{ color: 'var(--text-muted)' }}>Arrives</div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/live-tracking')}
                    className="bp-btn bp-btn--primary px-6 py-2.5 rounded-lg text-[13px] font-bold relative z-10 overflow-hidden group/btn"
                  >
                    <span className="relative z-10">Live Status</span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
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
                      <Icon size={24} style={{ color: f.color }} />
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
