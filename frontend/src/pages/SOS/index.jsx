/**
 * @file index.jsx (SOS Page)
 * @description Emergency alerts and help lines — polished, theme-aware design.
 */

import { useState } from 'react';
import { PhoneCall, ShieldAlert, HeartPulse, CheckCircle, AlertTriangle } from 'lucide-react';
import { sosService } from '../../services/sosService';

const emergencyContacts = [
  {
    title: 'Railway Police (RPF)',
    subtitle: 'Security & Safety',
    number: '139',
    icon: ShieldAlert,
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.10)',
  },
  {
    title: 'Medical Emergency',
    subtitle: 'Ambulance & Aid',
    number: '108',
    icon: HeartPulse,
    color: '#F43F5E',
    bg: 'rgba(244,63,94,0.10)',
  },
  {
    title: 'Women Helpline',
    subtitle: 'Safe Travel Support',
    number: '1091',
    icon: PhoneCall,
    color: '#A855F7',
    bg: 'rgba(168,85,247,0.10)',
  },
];

export default function SOS() {
  const [formData, setFormData] = useState({
    trainNo: '', coach: '', type: 'Medical Emergency', desc: '',
  });
  const [loading, setLoading] = useState(false);
  const [successStatus, setSuccessStatus] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const resp = await sosService.submitEmergency(formData);
      setSuccessStatus(resp.refId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen pb-16" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-[1050px] mx-auto px-4 pt-8" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* ═══ Page heading ═══ */}
        <div className="anim-fade-up">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-1 h-7 rounded-full" style={{ background: 'var(--danger)' }} />
            <h1
              className="text-[22px] font-bold"
              style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
            >
              SOS Emergency
            </h1>
          </div>
          <p className="text-[13px] pl-3.5" style={{ color: 'var(--text-secondary)' }}>
            Report severe issues or contact help lines immediately.
          </p>
        </div>

        {/* ═══ Emergency helpline cards ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {emergencyContacts.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className={`bp-card p-6 flex items-center gap-5 cursor-pointer group anim-fade-up anim-delay-${idx + 1}`}
                role="button"
                tabIndex={0}
                aria-label={`Call ${c.title}: ${c.number}`}
              >
                {/* Icon */}
                <div
                  className="bp-icon-box w-14 h-14 flex-shrink-0"
                  style={{
                    background: c.bg,
                    border: `1px solid ${c.color}22`,
                    animation: 'pulse-ring 2s ease-in-out infinite',
                    animationDelay: `${idx * 0.3}s`,
                  }}
                >
                  <Icon size={24} color={c.color} />
                </div>

                {/* Text */}
                <div>
                  <p className="text-[13px] font-semibold mb-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {c.title}
                  </p>
                  <p className="text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>
                    {c.subtitle}
                  </p>
                  <p
                    className="text-[34px] font-black leading-none tracking-wide"
                    style={{ color: c.color, fontFamily: "'Poppins', monospace" }}
                  >
                    {c.number}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══ Report an Incident ═══ */}
        <div className="bp-card overflow-hidden anim-fade-up anim-delay-4">
          {/* Header */}
          <div
            className="px-6 py-4 border-b flex items-center gap-2.5"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-surface-2)' }}
          >
            <ShieldAlert size={18} style={{ color: 'var(--danger)' }} />
            <h2
              className="text-[16px] font-bold"
              style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
            >
              Report an Incident
            </h2>
          </div>

          {/* Body */}
          <div className="p-6" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {successStatus ? (
              /* Success */
              <div className="text-center py-12 anim-scale-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <CheckCircle size={56} style={{ color: 'var(--success)' }} />
                <h3
                  className="text-xl font-bold"
                  style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
                >
                  Emergency Reported
                </h3>
                <p className="text-[14px] max-w-md" style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  Authorities have been notified. Your reference ID is{' '}
                  <span className="font-bold" style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>
                    {successStatus}
                  </span>.
                </p>
                <button
                  onClick={() => setSuccessStatus(null)}
                  className="bp-btn bp-btn--secondary mt-2"
                >
                  Report Another Incident
                </button>
              </div>
            ) : (
              <>
                {/* Row: Train + Coach */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bp-input-wrapper">
                    <label className="bp-label" htmlFor="sos-train">Train Number</label>
                    <input
                      id="sos-train"
                      className="bp-input"
                      placeholder="e.g. 12952"
                      value={formData.trainNo}
                      onChange={(e) => setFormData((f) => ({ ...f, trainNo: e.target.value }))}
                    />
                  </div>
                  <div className="bp-input-wrapper">
                    <label className="bp-label" htmlFor="sos-coach">Coach & Seat</label>
                    <input
                      id="sos-coach"
                      className="bp-input"
                      placeholder="e.g. B4, Seat 45"
                      value={formData.coach}
                      onChange={(e) => setFormData((f) => ({ ...f, coach: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Emergency Type */}
                <div className="bp-input-wrapper">
                  <label className="bp-label" htmlFor="sos-type">Emergency Type</label>
                  <select
                    id="sos-type"
                    className="bp-input"
                    value={formData.type}
                    onChange={(e) => setFormData((f) => ({ ...f, type: e.target.value }))}
                  >
                    <option>Medical Emergency</option>
                    <option>Security / Harassment</option>
                    <option>Fire / Technical Issue</option>
                    <option>Cleanliness Issue</option>
                  </select>
                </div>

                {/* Description */}
                <div className="bp-input-wrapper">
                  <label className="bp-label" htmlFor="sos-desc">Description</label>
                  <textarea
                    id="sos-desc"
                    rows={4}
                    className="bp-input"
                    placeholder="Provide precise details of the situation..."
                    style={{ resize: 'vertical', lineHeight: '1.6' }}
                    value={formData.desc}
                    onChange={(e) => setFormData((f) => ({ ...f, desc: e.target.value }))}
                  />
                </div>

                {/* Submit */}
                <button
                  className="bp-btn bp-btn--danger w-full py-3.5 text-[15px] font-bold flex items-center justify-center gap-2 bp-ripple"
                  onClick={handleSubmit}
                  disabled={loading}
                  onMouseEnter={(e) => e.currentTarget.style.animation = 'shake 0.5s ease-in-out'}
                  onAnimationEnd={(e) => e.currentTarget.style.animation = 'none'}
                >
                  <AlertTriangle size={18} />
                  {loading ? 'Alerting Authorities…' : 'Submit Emergency Alert'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
