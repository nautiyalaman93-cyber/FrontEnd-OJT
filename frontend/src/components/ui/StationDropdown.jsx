import { useState, useRef, useEffect } from 'react';
import { allStations } from '../../mock/mockData';
import { MapPin, Search } from 'lucide-react';

export default function StationDropdown({ label, value, onChange, placeholder = "Select station" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const filtered = allStations.filter(st =>
    st.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (station) => {
    onChange(station);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* ── Trigger ── */}
      <div
        className="w-full rounded-xl px-4 py-2.5 cursor-text transition-all duration-200"
        style={{
          background: 'var(--bg-input)',
          border: isOpen ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
          boxShadow: isOpen ? '0 0 0 3px var(--primary-glow)' : 'none',
        }}
        onClick={() => setIsOpen(true)}
        onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
        onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.borderColor = 'var(--border)'; }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-0.5"
          style={{ color: 'var(--primary)' }}
        >
          {label}
        </p>
        <p
          className="text-[14px] font-semibold truncate"
          style={{ color: value ? 'var(--text-primary)' : 'var(--text-muted)' }}
        >
          {value || placeholder}
        </p>
      </div>

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <div
          className="absolute top-[calc(100%+6px)] left-0 w-full rounded-xl overflow-hidden anim-scale-in"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
          }}
        >
          {/* Search input */}
          <div
            className="px-3 py-2.5 border-b"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-surface-2)' }}
          >
            <div className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}
            >
              <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search station name or code..."
                className="w-full bg-transparent text-[13px] font-medium outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          {/* Station list */}
          <div className="max-h-[220px] overflow-y-auto">
            {filtered.length > 0 ? filtered.map((st, idx) => {
              const parts = st.split(' | ');
              const stationName = parts[0];
              const stationCode = parts[1] || '';

              return (
                <div
                  key={idx}
                  className="px-4 py-2.5 cursor-pointer flex items-center justify-between gap-3 border-b last:border-0 transition-colors duration-150"
                  style={{ borderColor: 'var(--border-light)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                  onMouseDown={(e) => { 
                    e.preventDefault();
                    e.stopPropagation(); 
                    handleSelect(st); 
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span
                      className="text-[13px] font-semibold truncate"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {stationName}
                    </span>
                  </div>
                  {stationCode && (
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded shrink-0"
                      style={{
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {stationCode}
                    </span>
                  )}
                </div>
              );
            }) : (
              <div className="px-4 py-6 text-center text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>
                No stations found for "{query}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
