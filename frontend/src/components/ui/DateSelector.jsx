import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DateSelector({ label, value, onChange, placeholder = "Select Date" }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (day) => {
    onChange(`${day} Mar, 2026`);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Input Facade */}
      <div 
        className={`w-full bg-white border ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-50' : 'border-gray-300 hover:border-gray-400'} rounded-lg px-4 py-3 cursor-pointer transition-all flex items-center justify-between`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
          <p className={`text-base font-semibold truncate ${value ? 'text-gray-900' : 'text-gray-400'}`}>
            {value || placeholder}
          </p>
        </div>
        <CalendarIcon size={20} className="text-gray-400" />
      </div>

      {/* Popover */}
      {isOpen && (
        <div className="absolute top-[110%] left-0 w-[320px] z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
             <span className="font-bold text-gray-900 text-sm">March 2026</span>
             <div className="flex gap-2">
               <button type="button" className="p-1 rounded bg-gray-50 hover:bg-gray-100 text-gray-600"><ChevronLeft size={16}/></button>
               <button type="button" className="p-1 rounded bg-gray-50 hover:bg-gray-100 text-gray-600"><ChevronRight size={16}/></button>
             </div>
          </div>
          
          <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
            {['S','M','T','W','T','F','S'].map(d => <div key={d} className="font-bold text-gray-400 text-xs py-1">{d}</div>)}
            {/* Padding */}
            {[...Array(25)].map((_, i) => <div key={i} className="text-gray-300 font-medium py-1.5">{i+1}</div>)}
            {/* Active Dates */}
            <button type="button" className="bg-indigo-600 text-white font-bold rounded-md py-1.5 shadow-sm hover:bg-indigo-700 transition-colors" onClick={() => handleSelect('26')}>26</button>
            <button type="button" className="text-gray-700 font-bold hover:bg-gray-100 rounded-md py-1.5 transition-colors" onClick={() => handleSelect('27')}>27</button>
            <button type="button" className="text-gray-700 font-bold hover:bg-gray-100 rounded-md py-1.5 transition-colors" onClick={() => handleSelect('28')}>28</button>
          </div>
        </div>
      )}
    </div>
  );
}
