/**
 * @file index.jsx (Connecting Journeys Page)
 * @description Multi-train route finder — search-first, theme-aware, animated.
 */

import { useState } from 'react';
import { ArrowRight, Clock, Route, Search, ArrowLeftRight, Train, MapPin } from 'lucide-react';
import StationDropdown from '../../components/ui/StationDropdown';

/* Mock route data — shown only after search */
const mockRoutes = [
  {
    label: 'Option 1: via Vadodara',
    reliability: 'High Reliability',
    totalDuration: '21h 50m',
    legs: [
      { train: '12952 Rajdhani', from: 'New Delhi', to: 'Vadodara', time: '16:25 – 03:52' },
    ],
    layover: { station: 'Vadodara Jn', duration: '2h 15m' },
    legs2: [
      { train: '16345 Netravati', from: 'Vadodara', to: 'Ernakulam', time: '06:07 – 14:15' },
    ],
  },
  {
    label: 'Option 2: via Mumbai',
    reliability: 'Standard',
    totalDuration: '28h 20m',
    legs: [
      { train: '12952 Rajdhani', from: 'New Delhi', to: 'Mumbai Central', time: '16:25 – 08:35' },
    ],
    layover: { station: 'Mumbai Central', duration: '4h 45m' },
    legs2: [
      { train: '16312 Kochuveli Exp', from: 'Mumbai Central', to: 'Ernakulam', time: '13:20 – 16:40' },
    ],
  },
];

export default function ConnectingJourneys() {
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSwap = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleSearch = () => {
    if (!fromStation || !toStation) return;
    setIsSearching(true);
    setHasSearched(false);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 600);
  };

  return (
    <div className="w-full pb-16 min-h-screen" style={{ background: 'var(--bg-page)' }}>

      {/* ═══ Header ═══ */}
      <section
        className="py-6 mb-8 border-b anim-fade-in"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-[1000px] mx-auto px-4 anim-slide-left">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--primary-light)', border: '1px solid var(--border)' }}
            >
              <Route size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h1
                className="text-xl font-bold"
                style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
              >
                Connecting Routes
              </h1>
              <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                Find alternative multi-train connections for your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Search Card ═══ */}
      <section className="max-w-[1000px] mx-auto px-4 mb-8">
        <div
          className="rounded-2xl p-5 anim-fade-up"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex flex-col md:flex-row items-end gap-4">
            {/* From */}
            <div className="flex-1 w-full">
              <StationDropdown
                label="From"
                value={fromStation}
                onChange={setFromStation}
                placeholder="Origin station"
              />
            </div>

            {/* Swap */}
            <button
              onClick={handleSwap}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200"
              style={{
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = 'var(--primary)';
                e.currentTarget.style.transform = 'rotate(180deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.transform = 'rotate(0deg)';
              }}
              title="Swap stations"
            >
              <ArrowLeftRight size={16} />
            </button>

            {/* To */}
            <div className="flex-1 w-full">
              <StationDropdown
                label="To"
                value={toStation}
                onChange={setToStation}
                placeholder="Destination station"
              />
            </div>

            {/* Search */}
            <button
              className="bp-btn bp-btn--primary px-8 py-3 text-[14px] font-bold flex items-center gap-2 shrink-0"
              onClick={handleSearch}
              disabled={!fromStation || !toStation || isSearching}
            >
              <Search size={16} />
              {isSearching ? 'Searching…' : 'FIND ROUTES'}
            </button>
          </div>
        </div>
      </section>

      {/* ═══ Results — shown only after search ═══ */}
      {hasSearched && (
        <section className="max-w-[1000px] mx-auto px-4 space-y-6">
          {/* Route summary badge */}
          <div className="flex items-center gap-3 anim-fade-up">
            <div className="w-1.5 h-6 rounded-full" style={{ background: 'var(--primary)' }} />
            <h2
              className="text-[17px] font-bold"
              style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
            >
              {mockRoutes.length} connecting routes found
            </h2>
            <div
              className="text-[11px] font-bold px-3 py-0.5 rounded-full"
              style={{
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                border: '1px solid var(--primary)',
              }}
            >
              {fromStation.split(' | ')[0]} → {toStation.split(' | ')[0]}
            </div>
          </div>

          {mockRoutes.map((route, rIdx) => (
            <div key={rIdx} className={`bp-card overflow-hidden anim-fade-up anim-delay-${rIdx + 1}`}>

              {/* Route header */}
              <div
                className="px-5 py-3.5 border-b flex justify-between items-center"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-surface-2)' }}
              >
                <h3 className="text-[14px] font-bold" style={{ color: 'var(--text-heading)' }}>
                  {route.label}
                </h3>
                <span
                  className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md"
                  style={{
                    background: rIdx === 0 ? 'var(--success-bg)' : 'var(--bg-surface-2)',
                    color: rIdx === 0 ? 'var(--success)' : 'var(--text-secondary)',
                    border: `1px solid ${rIdx === 0 ? 'var(--success)' : 'var(--border)'}`,
                  }}
                >
                  {route.reliability}
                </span>
              </div>

              {/* Route timeline */}
              <div className="p-6">
                <div
                  className="relative pl-7 py-1 space-y-5"
                  style={{ borderLeft: '2px dashed var(--border)' }}
                >
                  {/* Leg 1 */}
                  {route.legs.map((leg, i) => (
                    <div key={i} className="relative">
                      <div
                        className="absolute -left-[28px] top-5 w-4 h-4 rounded-full border-[2.5px]"
                        style={{ borderColor: 'var(--primary)', background: 'var(--bg-surface)' }}
                      />
                      <div
                        className="rounded-xl p-4 transition-colors duration-200"
                        style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-light)' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[11px] font-bold uppercase mb-0.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                              <Train size={12} style={{ color: 'var(--primary)' }} />
                              {leg.train}
                            </p>
                            <h4 className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>
                              {leg.from} → {leg.to}
                            </h4>
                          </div>
                          <p className="font-bold text-[13px]" style={{ color: 'var(--secondary)' }}>
                            {leg.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Layover */}
                  <div className="relative">
                    <div
                      className="absolute -left-[26px] top-1/2 -translate-y-1/2 rounded-full p-0.5"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                    >
                      <Clock size={12} style={{ color: 'var(--warning)' }} />
                    </div>
                    <div className="pl-2 py-1">
                      <p className="text-[13px] font-bold" style={{ color: 'var(--warning)' }}>
                        {route.layover.duration} Layover at{' '}
                        <span className="uppercase tracking-wide">{route.layover.station}</span>
                      </p>
                    </div>
                  </div>

                  {/* Leg 2 */}
                  {route.legs2.map((leg, i) => (
                    <div key={i} className="relative">
                      <div
                        className="absolute -left-[28px] top-5 w-4 h-4 rounded-full border-[3.5px]"
                        style={{ borderColor: 'var(--success)', background: 'var(--bg-surface)' }}
                      />
                      <div
                        className="rounded-xl p-4 transition-colors duration-200"
                        style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-light)' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-light)'}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-[11px] font-bold uppercase mb-0.5 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                              <Train size={12} style={{ color: 'var(--success)' }} />
                              {leg.train}
                            </p>
                            <h4 className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>
                              {leg.from} → {leg.to}
                            </h4>
                          </div>
                          <p className="font-bold text-[13px]" style={{ color: 'var(--secondary)' }}>
                            {leg.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer: total duration (NO Book Now button) */}
                <div
                  className="mt-6 p-4 rounded-xl flex items-center justify-between"
                  style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border)' }}
                >
                  <div>
                    <p className="text-[11px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Total Duration</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>{route.totalDuration}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      {route.legs.length + route.legs2.length} trains
                    </span>
                    <div className="w-1 h-1 rounded-full" style={{ background: 'var(--text-muted)' }} />
                    <span className="text-[12px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      1 layover
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ═══ Empty state ═══ */}
      {!hasSearched && !isSearching && (
        <div className="max-w-[500px] mx-auto text-center py-16 px-4 anim-fade-up anim-delay-2">
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--primary-light)', border: '1px solid var(--border)' }}
          >
            <Route size={28} style={{ color: 'var(--primary)' }} />
          </div>
          <h3
            className="text-lg font-bold mb-2"
            style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
          >
            Find connecting routes
          </h3>
          <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
            Select your origin and destination above to discover alternative multi-train connections.
          </p>
        </div>
      )}
    </div>
  );
}
