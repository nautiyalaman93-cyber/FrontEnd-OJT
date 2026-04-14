/**
 * @file index.jsx (Proximity Alerts Page)
 * @description GPS-triggered destination alarms — theme-aware, animated.
 */

import { useState, useEffect } from 'react';
import { MapPin, Bell, BellRing, Gauge, RadioTower, LocateFixed, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { alertService } from '../../services/alertService';
import StationDropdown from '../../components/ui/StationDropdown';

export default function ProximityAlerts() {
  const [activeAlertId, setActiveAlertId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadAlerts();
    }
  }, [user]);

  const loadAlerts = async () => {
    const alerts = await alertService.getAlerts();
    if (alerts.length > 0) {
      const current = alerts[0]; // just take the most recent active one for now
      setTrainNumber(current.trainNumber);
      setTargetStation(current.targetStation);
      setDistance(current.distanceKm);
      setIsActive(true);
      setAlertSet(true);
      setActiveAlertId(current._id);
    }
  };

  const handleActivate = async () => {
    if (!targetStation || !trainNumber || !user) return;
    setIsProcessing(true);
    setHasSearched(true);
    
    try {
      const newAlert = await alertService.createAlert(trainNumber, targetStation, distance);
      setActiveAlertId(newAlert._id);
      setAlertSet(true);
    } catch (e) {
      console.error(e);
      alert('Failed to set alarm.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (activeAlertId) {
      await alertService.cancelAlert(activeAlertId);
    }
    setAlertSet(false);
    setIsActive(false);
    setHasSearched(false);
    setTargetStation('');
    setTrainNumber('');
    setActiveAlertId(null);
  };

  return (
    <div className="w-full pb-16 min-h-screen" style={{ background: 'var(--bg-page)' }}>

      {/* ═══ Header ═══ */}
      <section
        className="py-6 mb-8 border-b anim-fade-in"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-[1000px] mx-auto px-4 flex items-center gap-3 anim-slide-left">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--primary-light)', border: '1px solid var(--border)' }}
          >
            <RadioTower size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h1
              className="text-xl font-bold"
              style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
            >
              Destination Alarms
            </h1>
            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              GPS-triggered wake-up calls based on train proximity.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Configuration Card ═══ */}
      <section className="max-w-[620px] mx-auto px-4">
        <div className="bp-card anim-fade-up" style={{ overflow: 'visible' }}>

          {/* Card header with toggle */}
          <div
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-surface-2)' }}
          >
            <div className="flex items-center gap-2.5">
              <BellRing size={18} style={{ color: 'var(--primary)' }} />
              <h2
                className="text-[15px] font-bold uppercase tracking-wide"
                style={{ color: 'var(--text-heading)' }}
              >
                Configure Alarm
              </h2>
            </div>

            {/* Toggle switch */}
            <button
              onClick={() => setIsActive(!isActive)}
              className="relative w-12 h-7 rounded-full transition-colors duration-300"
              style={{
                background: isActive ? 'var(--primary)' : 'var(--border)',
                boxShadow: isActive ? '0 0 12px var(--primary-glow)' : 'none',
              }}
              aria-label="Toggle alarm"
            >
              <span
                className="absolute top-[3px] left-[3px] w-[20px] h-[20px] rounded-full bg-white transition-transform duration-300"
                style={{
                  transform: isActive ? 'translateX(21px)' : 'translateX(0)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                }}
              />
            </button>
          </div>

          {/* Card body */}
          <div
            className="p-6 space-y-5 transition-opacity duration-300"
            style={{ opacity: isActive ? 1 : 0.35, pointerEvents: isActive ? 'auto' : 'none' }}
          >

            {/* Train number */}
            <div className="bp-input-wrapper anim-fade-up anim-delay-1">
              <label className="bp-label">Train Number</label>
              <input
                className="bp-input"
                placeholder="e.g. 12952"
                value={trainNumber}
                onChange={(e) => setTrainNumber(e.target.value)}
              />
            </div>

            {/* Target station dropdown */}
            <div className="relative anim-fade-up anim-delay-2" style={{ zIndex: 50 }}>
              <label
                className="block text-[12px] font-semibold uppercase tracking-wide mb-1.5"
                style={{ color: 'var(--text-secondary)', letterSpacing: '0.05em' }}
              >
                Target Station
              </label>
              <StationDropdown
                label="Station"
                value={targetStation}
                onChange={setTargetStation}
                placeholder="Select your destination station"
              />
            </div>

            {/* Trigger radius slider */}
            <div className="anim-fade-up anim-delay-3">
              <div className="flex justify-between items-end mb-3">
                <label className="bp-label">Trigger Radius</label>
                <p className="text-[20px] font-bold" style={{ color: 'var(--text-heading)' }}>
                  {distance}
                  <span className="text-[13px] font-semibold ml-1" style={{ color: 'var(--text-muted)' }}>km</span>
                </p>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--primary) ${((distance - 5) / 45) * 100}%, var(--border) ${((distance - 5) / 45) * 100}%)`,
                  accentColor: 'var(--primary)',
                }}
              />
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wide mt-2" style={{ color: 'var(--text-muted)' }}>
                <span>5 km</span>
                <span>50 km</span>
              </div>
            </div>

            {/* Save / activate button */}
            <div className="pt-4 border-t anim-fade-up anim-delay-4" style={{ borderColor: 'var(--border)' }}>
              {!user ? (
                <div className="p-3 mb-2 rounded-xl text-center text-[12px] font-semibold flex items-center justify-center gap-2" style={{ background: 'var(--warning-light)', color: 'var(--warning)' }}>
                  <LogIn size={14} /> You must be logged in to set alarms.
                </div>
              ) : null}
              <button
                className="bp-btn bp-btn--primary w-full py-3 text-[14px] font-bold flex items-center justify-center gap-2"
                disabled={!isActive || !targetStation || !trainNumber || !user || isProcessing}
                onClick={handleActivate}
              >
                <LocateFixed size={16} />
                {isProcessing ? 'SAVING...' : 'SET ALARM'}
              </button>
            </div>
          </div>
        </div>

        {/* ═══ Alert Set Confirmation ═══ */}
        {alertSet && (
          <div className="mt-6 bp-card p-6 text-center anim-scale-in">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{
                background: 'var(--success-bg)',
                border: '1px solid var(--success)',
              }}
            >
              <Bell size={28} style={{ color: 'var(--success)' }} />
            </div>
            <h3
              className="text-lg font-bold mb-1"
              style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
            >
              Alarm Active
            </h3>
            <p className="text-[14px] mb-1" style={{ color: 'var(--text-secondary)' }}>
              You'll be alerted when your train is within <strong style={{ color: 'var(--primary)' }}>{distance} km</strong> of
            </p>
            <p className="text-[15px] font-bold mb-6" style={{ color: 'var(--text-heading)' }}>
              {targetStation}
            </p>
            <button
              onClick={handleCancel}
              className="bp-btn py-2.5 px-6 text-[13px] font-bold uppercase tracking-wide transition-all"
              style={{
                background: 'transparent',
                border: '1.5px solid var(--danger)',
                color: 'var(--danger)',
                borderRadius: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--danger-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Cancel Alarm
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
