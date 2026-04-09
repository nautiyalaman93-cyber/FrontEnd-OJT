/**
 * @file index.jsx (Live Tracking Page)
 * @description Theme-aware live tracking board with timeline animation.
 */

import { useState } from 'react';
import { Train as TrainIcon, Clock, Activity, MapPin, Gauge, Navigation } from 'lucide-react';

export default function LiveTracking() {
  const [trainNumber, setTrainNumber] = useState('12952');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 800);
  };

  const routeStations = [
    { name: 'New Delhi (NDLS)',      time: '16:25', status: 'Departed',     active: false, passed: true },
    { name: 'Kota Jn (KOTA)',       time: '21:00', status: 'Departed',     active: false, passed: true },
    { name: 'Ratlam Jn (RTM)',      time: '00:15', status: 'Departed',     active: false, passed: true },
    { name: 'Vadodara Jn (BRC)',    time: '03:52', status: 'Arriving Now', active: true,  passed: false },
    { name: 'Surat (ST)',           time: '05:43', status: 'Expected',     active: false, passed: false },
    { name: 'Borivali (BVI)',       time: '08:40', status: 'Expected',     active: false, passed: false },
    { name: 'Mumbai Central (MMCT)',time: '09:35', status: 'Destination',  active: false, passed: false },
  ];

  return (
    <div className="w-full pb-16 min-h-screen" style={{ background: 'var(--bg-page)' }}>

      {/* ═══ Header ═══ */}
      <section
        className="py-6 mb-6 border-b anim-fade-in"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-[1000px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="anim-slide-left">
            <h1
              className="text-xl font-bold flex items-center gap-2"
              style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
            >
              <Navigation size={20} style={{ color: 'var(--primary)' }} />
              Live Train Status
            </h1>
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Real-time GPS tracking for exact delay statistics
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex items-center w-full sm:w-[400px] rounded-xl overflow-hidden anim-fade-up anim-delay-1"
            style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}
          >
            <div className="relative flex-1 flex items-center" style={{ background: 'var(--bg-input)' }}>
              <div className="pl-3 pr-2 flex items-center pointer-events-none">
                <TrainIcon size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
              <input
                type="text"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
                placeholder="Train Number"
                className="w-full pr-3 py-2.5 bg-transparent focus:outline-none text-[14px] font-semibold"
                style={{ color: 'var(--text-primary)' }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bp-btn bp-btn--primary rounded-none px-6 h-full text-[13px] font-bold"
            >
              {isSearching ? '…' : 'Check'}
            </button>
          </form>
        </div>
      </section>

      {/* ═══ Results ═══ */}
      {hasSearched && (
        <section className="max-w-[1000px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 anim-fade-up">

          {/* Timeline */}
          <div className="lg:col-span-2 bp-card overflow-hidden">
            <div
              className="px-5 py-4 border-b"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-surface-2)' }}
            >
              <h2 className="text-[15px] font-bold" style={{ color: 'var(--text-heading)' }}>
                Train Route & Progress
              </h2>
            </div>

            <div className="p-6 relative">
              {/* Vertical spine */}
              <div
                className="absolute top-8 bottom-8 left-[35px] w-[3px] rounded-full"
                style={{ background: 'var(--border)' }}
              />
              <div
                className="absolute top-8 left-[35px] w-[3px] rounded-full z-0"
                style={{ background: 'var(--success)', height: '50%' }}
              />

              {routeStations.map((station, idx) => (
                <div
                  key={idx}
                  className={`relative z-10 flex gap-5 items-center mb-6 last:mb-0 anim-fade-up anim-delay-${Math.min(idx + 1, 6)}`}
                >
                  {/* Node */}
                  <div
                    className="w-[22px] h-[22px] rounded-full border-[3px] flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'var(--bg-surface)',
                      borderColor: station.active ? 'var(--primary)' : station.passed ? 'var(--success)' : 'var(--border)',
                      boxShadow: station.active ? '0 0 0 4px var(--primary-glow)' : 'none',
                    }}
                  >
                    {station.active && (
                      <div className="w-[10px] h-[10px] rounded-full" style={{ background: 'var(--primary)' }} />
                    )}
                  </div>

                  {/* Station card */}
                  <div
                    className="flex-1 rounded-xl px-4 py-3 flex justify-between items-center transition-colors duration-200"
                    style={{
                      background: station.active ? 'var(--primary-light)' : 'var(--bg-surface-2)',
                      border: station.active ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                    }}
                    onMouseEnter={(e) => { if (!station.active) e.currentTarget.style.borderColor = 'var(--primary)'; }}
                    onMouseLeave={(e) => { if (!station.active) e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                  >
                    <div>
                      <p
                        className="font-semibold text-[14px]"
                        style={{ color: station.active ? 'var(--primary)' : 'var(--text-primary)' }}
                      >
                        {station.name}
                      </p>
                      <p className="text-[11px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {station.status}
                      </p>
                    </div>
                    <p
                      className="text-[14px] font-bold"
                      style={{ color: station.active ? 'var(--primary)' : 'var(--text-secondary)' }}
                    >
                      {station.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ Metrics sidebar ═══ */}
          <div className="space-y-4">
            {/* Train info */}
            <div className="bp-card p-5 text-center anim-scale-in anim-delay-1">
              <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                12952 MUMBAI RAJDHANI
              </p>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}>
                Vadodara Jn
              </h3>

              <div className="grid grid-cols-2 gap-3 text-left">
                {/* Speed */}
                <div
                  className="p-3.5 rounded-xl"
                  style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-light)' }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Gauge size={12} style={{ color: 'var(--primary)' }} />
                    <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Speed</p>
                  </div>
                  <p className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>112 km/h</p>
                </div>
                {/* Distance */}
                <div
                  className="p-3.5 rounded-xl"
                  style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-light)' }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin size={12} style={{ color: 'var(--secondary)' }} />
                    <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Remaining</p>
                  </div>
                  <p className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>392 km</p>
                </div>
              </div>
            </div>

            {/* Punctuality + delay */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bp-card p-4 text-center anim-scale-in anim-delay-2">
                <Clock size={20} style={{ color: 'var(--success)' }} className="mx-auto mb-1.5" />
                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Punctuality</p>
                <p className="text-[14px] font-bold mt-0.5" style={{ color: 'var(--success)' }}>On Time</p>
              </div>
              <div className="bp-card p-4 text-center anim-scale-in anim-delay-3">
                <Activity size={20} style={{ color: 'var(--warning)' }} className="mx-auto mb-1.5" />
                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Delay</p>
                <p className="text-[14px] font-bold mt-0.5" style={{ color: 'var(--warning)' }}>25 Mins</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {!hasSearched && (
        <div className="max-w-[500px] mx-auto text-center py-20 px-4 anim-fade-up anim-delay-2">
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--primary-light)', border: '1px solid var(--border)' }}
          >
            <TrainIcon size={28} style={{ color: 'var(--primary)' }} />
          </div>
          <h3
            className="text-lg font-bold mb-2"
            style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
          >
            Search a train to track
          </h3>
          <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
            Enter the train number above to see real-time route progress, speed, and delay metrics.
          </p>
        </div>
      )}
    </div>
  );
}
