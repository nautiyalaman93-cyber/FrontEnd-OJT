/**
 * @file index.jsx (Live Tracking Page)
 * @description Theme-aware live tracking board with real API integration.
 */

import { useState, useEffect } from 'react';
import { Train as TrainIcon, Clock, Activity, MapPin, Gauge, Navigation, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function LiveTracking() {
  const [trainNumber, setTrainNumber] = useState('12952');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [trainData, setTrainData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setError(null);
    try {
      // Fix: Use local date formatting to avoid timezone shift
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}${month}${day}`;
      
      const data = await api.getTrainStatus(trainNumber, dateStr);
      if (data) {
        setTrainData(data);
        setHasSearched(true);
      } else {
        setError('Train data not found. Please check the train number.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch train status. Please try again later.');
    } finally {
      setIsSearching(false);
    }
  };

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

      {/* ═══ Error State ═══ */}
      {error && (
        <div className="max-w-[1000px] mx-auto px-4 mb-6">
          <div className="p-4 rounded-xl flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 text-[14px] font-medium">
            <AlertCircle size={18} />
            {error}
          </div>
        </div>
      )}

      {/* ═══ Results ═══ */}
      {hasSearched && trainData && (
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
              
              {/* Progress fill */}
              <div
                className="absolute top-8 left-[35px] w-[3px] rounded-full z-0 transition-all duration-1000"
                style={{ 
                  background: 'var(--success)', 
                  height: trainData.route ? `${(trainData.route.filter(s => s.status === 'departed' || s.status === 'current').length / trainData.route.length) * 100}%` : '0%'
                }}
              />

              {trainData.route && trainData.route.map((station, idx) => {
                const isPassed = station.status === 'departed';
                const isCurrent = station.status === 'current';

                return (
                  <div
                    key={idx}
                    className={`relative z-10 flex gap-5 items-center mb-6 last:mb-0 anim-fade-up anim-delay-${Math.min(idx + 1, 6)}`}
                  >
                    {/* Node */}
                    <div
                      className="w-[22px] h-[22px] rounded-full border-[3px] flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'var(--bg-surface)',
                        borderColor: isCurrent ? 'var(--primary)' : isPassed ? 'var(--success)' : 'var(--border)',
                        boxShadow: isCurrent ? '0 0 0 4px var(--primary-glow)' : 'none',
                      }}
                    >
                      {isCurrent && (
                        <div className="w-[10px] h-[10px] rounded-full" style={{ background: 'var(--primary)' }} />
                      )}
                    </div>

                    {/* Station card */}
                    <div
                      className="flex-1 rounded-xl px-4 py-3 flex justify-between items-center transition-colors duration-200"
                      style={{
                        background: isCurrent ? 'var(--primary-light)' : 'var(--bg-surface-2)',
                        border: isCurrent ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                      }}
                    >
                      <div>
                        <p
                          className="font-semibold text-[14px]"
                          style={{ color: isCurrent ? 'var(--primary)' : 'var(--text-primary)' }}
                        >
                          {station.station_name || station.stationName || station.name} ({station.station_code || station.stationCode || station.code})
                        </p>
                        <p className="text-[11px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {station.status === 'departed' ? 'Departed' : station.status === 'current' ? 'At Station' : 'Upcoming'}
                          {(station.delay || station.latemin || 0) > 0 && <span className="ml-2" style={{ color: '#D97706' }}>({station.delay || station.latemin}m delay)</span>}
                        </p>
                      </div>
                      <p
                        className="text-[14px] font-bold"
                        style={{ color: isCurrent ? 'var(--primary)' : 'var(--text-secondary)' }}
                      >
                        {station.actual_arrival || station.actualArrival || station.scheduled_arrival || station.scheduledArrival || '--:--'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══ Metrics sidebar ═══ */}
          <div className="space-y-4">
            {/* Train info */}
            <div className="bp-card p-5 text-center anim-scale-in anim-delay-1">
              <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
                {trainData.train_number || trainData.trainNumber} {trainData.train_name || trainData.trainName}
              </p>
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}>
                {trainData.current_station_name || trainData.currentStationName || 'Tracking...'}
              </h3>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div
                  className="p-3.5 rounded-xl"
                  style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-light)' }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Gauge size={12} style={{ color: 'var(--primary)' }} />
                    <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Speed</p>
                  </div>
                  <p className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>{trainData.speed || '0'} km/h</p>
                </div>
                <div
                  className="p-3.5 rounded-xl"
                  style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-light)' }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <MapPin size={12} style={{ color: 'var(--secondary)' }} />
                    <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Delay</p>
                  </div>
                  <p className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>{trainData.delay || '0'} m</p>
                </div>
              </div>
            </div>

            {/* Punctuality + delay */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bp-card p-4 text-center anim-scale-in anim-delay-2">
                <Clock size={20} style={{ color: trainData.delay > 0 ? '#D97706' : '#10B981' }} className="mx-auto mb-1.5" />
                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Status</p>
                <p className="text-[14px] font-bold mt-0.5" style={{ color: trainData.delay > 0 ? '#D97706' : '#10B981' }}>
                  {trainData.delay > 0 ? 'Delayed' : 'On Time'}
                </p>
              </div>
              <div className="bp-card p-4 text-center anim-scale-in anim-delay-3">
                <Activity size={20} style={{ color: 'var(--primary)' }} className="mx-auto mb-1.5" />
                <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Last Updated</p>
                <p className="text-[14px] font-bold mt-0.5" style={{ color: 'var(--text-heading)' }}>
                  {trainData.lastUpdated ? new Date(trainData.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {!hasSearched && !isSearching && (
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

      {/* Loading state */}
      {isSearching && (
        <div className="max-w-[500px] mx-auto text-center py-20 px-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[14px] font-bold" style={{ color: 'var(--text-secondary)' }}>Fetching live telemetry...</p>
        </div>
      )}
    </div>
  );
}
