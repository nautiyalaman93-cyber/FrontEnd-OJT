import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Search, CalendarDays } from 'lucide-react';
import StationDropdown from './StationDropdown';
import DateSelector from './DateSelector';

export default function SearchBar({ onSearch, isSearching }) {
  const navigate = useNavigate();
  const [fromStation, setFromStation] = useState('NEW DELHI | NDLS');
  const [toStation, setToStation] = useState('MUMBAI CENTRAL | MMCT');
  // Generate 3 quick dates starting from today
  const getUpcomingDates = () => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return [0, 1, 2].map(offset => {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      const day = String(d.getDate()).padStart(2, '0');
      const monthNum = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const machineDate = `${year}${monthNum}${day}`;
      return { label: `${d.getDate()} ${months[d.getMonth()]}`, value: machineDate };
    });
  };
  const dates = getUpcomingDates();

  const [journeyDate, setJourneyDate] = useState(dates[0].value);
  const [journeyLabel, setJourneyLabel] = useState(dates[0].label);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  // Close calendar on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isQuickDate = dates.some(d => d.value === journeyDate);

  const handleSwap = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fromStation && toStation && journeyDate) {
      // Extract codes: "NEW DELHI | NDLS" -> "NDLS"
      const fromCode = fromStation.split(' | ')[1] || fromStation;
      const toCode = toStation.split(' | ')[1] || toStation;

      if (onSearch) {
        onSearch({ fromStation: fromCode, toStation: toCode, journeyDate });
      } else {
        navigate('/live-tracking');
      }
    }
  };

  return (
    <div className="w-full relative z-40 rounded-2xl p-4 overflow-visible" style={{ background: 'var(--bg-surface)' }}>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row items-center gap-0 w-full mb-4">

        <div className="w-full lg:flex-1 relative">
          <StationDropdown label="From" value={fromStation} onChange={setFromStation} />

          {/* Desktop swap */}
          <button
            type="button"
            onClick={handleSwap}
            className="hidden lg:flex absolute -right-[16px] top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full items-center justify-center shadow-sm transition-all duration-200"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
            title="Swap Stations"
          >
            <ArrowLeftRight size={14} />
          </button>
        </div>

        {/* Mobile swap */}
        <button
          type="button"
          onClick={handleSwap}
          className="flex lg:hidden w-8 h-8 my-2 rounded-full items-center justify-center"
          style={{
            background: 'var(--bg-surface-2)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
          }}
        >
          <ArrowLeftRight size={14} className="rotate-90" />
        </button>

        <div className="w-full lg:flex-1 pl-0 lg:pl-[12px]">
          <StationDropdown label="To" value={toStation} onChange={setToStation} />
        </div>

        {/* Date pills + Select Date */}
        <div
          className="w-full lg:w-auto flex items-center justify-between rounded-lg p-0.5 ml-0 lg:ml-4 mt-4 lg:mt-0 overflow-visible relative"
          style={{ border: '1px solid var(--border)', background: 'var(--bg-surface-2)' }}
        >
          {dates.map((d) => (
            <div
              key={d.value}
              onClick={() => { setJourneyDate(d.value); setJourneyLabel(d.label); setShowCalendar(false); }}
              className="px-4 py-3 cursor-pointer text-sm font-semibold text-center transition-all duration-200"
              style={{
                background: journeyDate === d.value ? 'var(--primary)' : 'transparent',
                color: journeyDate === d.value ? '#FFFFFF' : 'var(--text-primary)',
                borderRadius: journeyDate === d.value ? '6px' : '0',
              }}
              onMouseEnter={(e) => {
                if (journeyDate !== d.value) e.currentTarget.style.background = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                if (journeyDate !== d.value) e.currentTarget.style.background = 'transparent';
              }}
            >
              {d.label}
            </div>
          ))}

          {/* Select Date button */}
          <div ref={calendarRef} className="relative">
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className="px-3 py-3 cursor-pointer text-sm font-semibold text-center transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap"
              style={{
                background: !isQuickDate ? 'var(--primary)' : 'transparent',
                color: !isQuickDate ? '#FFFFFF' : 'var(--text-primary)',
                borderRadius: !isQuickDate ? '6px' : '0',
              }}
              onMouseEnter={(e) => {
                if (isQuickDate) e.currentTarget.style.background = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                if (isQuickDate) e.currentTarget.style.background = 'transparent';
              }}
            >
              <CalendarDays size={14} />
              {!isQuickDate ? journeyDate : 'More'}
            </div>

            {/* Calendar popup */}
            {showCalendar && (
              <div className="absolute top-[110%] right-0 z-50">
                <DateSelector
                  label="Journey Date"
                  value={journeyLabel}
                  onChange={(val) => { 
                    // val is "DD MMM", we need to convert to YYYY-MM-DD or similar if needed
                    // For simplicity, let's just use the label for display and a guess for value
                    // or better, update DateSelector to return a full date object.
                    setJourneyLabel(val);
                    setJourneyDate(val); // This might still be "DD MMM", but searchTrains will handle it
                    setShowCalendar(false); 
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Search button */}
        <div className="w-full lg:w-[140px] ml-0 lg:ml-4 mt-4 lg:mt-0">
          <button
            type="submit"
            disabled={isSearching}
            className="bp-btn bp-btn--primary w-full py-3 text-[14px] font-bold tracking-wide rounded-lg"
          >
            {isSearching ? 'Searching…' : 'SEARCH'}
          </button>
        </div>
      </form>

      {/* Filters row */}
      <div
        className="flex flex-wrap items-center gap-6 pt-3 border-t"
        style={{ borderColor: 'var(--border-light)' }}
      >
        <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
          <input type="checkbox" className="w-4 h-4" style={{ accentColor: 'var(--primary)' }} /> AC Only
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
          <input type="checkbox" className="w-4 h-4" style={{ accentColor: 'var(--primary)' }} /> Confirmed Seats
        </label>

        <div className="flex items-center gap-2 ml-auto">
          <select
            className="text-[13px] rounded-lg px-2.5 py-1.5 outline-none font-medium"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            <option>All Classes</option>
            <option>1A (First AC)</option>
            <option>2A (Second AC)</option>
            <option>3A (Third AC)</option>
            <option>SL (Sleeper)</option>
          </select>
          <select
            className="text-[13px] rounded-lg px-2.5 py-1.5 outline-none font-medium"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            <option>General Quota</option>
            <option>Tatkal</option>
            <option>Ladies</option>
          </select>
        </div>
      </div>
    </div>
  );
}
