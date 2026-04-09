/**
 * @file index.jsx (Seat Exchange Page)
 * @description P2P seat swap board — train-based, search-first, theme-aware, animated.
 * Both passengers must be on the same train, so train number is required first.
 */

import { useState } from 'react';
import {
  User, RefreshCcw, AlertTriangle, ArrowRightLeft,
  Clock, Info, Search, Train, CheckCircle2, XCircle,
} from 'lucide-react';

import { seatService } from '../../services/seatService';

export default function SeatExchange() {
  const [trainNumber, setTrainNumber] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');

  /* ── Form state ── */
  const [myPnr, setMyPnr] = useState('');
  const [mySeat, setMySeat] = useState('');
  const [myTarget, setMyTarget] = useState('Upper Berth');
  const [postSuccess, setPostSuccess] = useState(false);

  const [allRequests, setAllRequests] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);

  // Filter requests by train number when searched
  const requests = hasSearched
    ? allRequests.filter(req => req.trainNumber === trainNumber)
    : [];

  const handleSearch = async () => {
    if (!trainNumber.trim()) return;
    setIsSearching(true);
    setHasSearched(false);
    setPostSuccess(false);
    
    setFetchLoading(true);
    try {
      const data = await seatService.getRequests();
      setAllRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchLoading(false);
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!myPnr || !mySeat) return;
    
    try {
      const coachValue = mySeat.split('|')[0]?.trim() || 'Unknown';
      await seatService.submitRequest({
        trainNumber,
        journeyDate: new Date().toISOString().split('T')[0], // Today's date by default
        coach: coachValue,
        currentSeat: mySeat,
        wantedSeat: myTarget
      });
      
      setPostSuccess(true);
      setMyPnr('');
      setMySeat('');
      
      // Refresh list
      handleSearch();
      
      setTimeout(() => setPostSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to post swap request', err);
    }
  };

  return (
    <div className="w-full pb-16 min-h-screen" style={{ background: 'var(--bg-page)' }}>

      {/* ═══ Header ═══ */}
      <section
        className="py-6 mb-8 border-b anim-fade-in"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-[1050px] mx-auto px-4 anim-slide-left">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--primary-light)', border: '1px solid var(--border)' }}
            >
              <ArrowRightLeft size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h1
                className="text-xl font-bold"
                style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
              >
                P2P Seat Exchange
              </h1>
              <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                Find co-passengers on the same train and negotiate seat swaps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Search Card — Train Number ═══ */}
      <section className="max-w-[1050px] mx-auto px-4 mb-8">
        <div className="bp-card p-5 anim-fade-up">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label className="bp-label">Train Number</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'var(--primary-light)', border: '1px solid var(--border)' }}
                >
                  <Train size={18} style={{ color: 'var(--primary)' }} />
                </div>
                <input
                  className="bp-input"
                  type="text"
                  placeholder="Enter train number (e.g. 12952)"
                  value={trainNumber}
                  onChange={(e) => setTrainNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <p className="text-[11px] mt-1.5 font-medium" style={{ color: 'var(--text-muted)' }}>
                Both passengers must be on the same train for seat exchange.
              </p>
            </div>
            <button
              className="bp-btn bp-btn--primary px-8 py-3 text-[14px] font-bold flex items-center gap-2 shrink-0"
              onClick={handleSearch}
              disabled={!trainNumber.trim() || isSearching}
            >
              <Search size={16} />
              {isSearching ? 'Searching…' : 'FIND SWAPS'}
            </button>
          </div>
        </div>
      </section>

      {/* ═══ Results — ONLY shown after search ═══ */}
      {hasSearched && (
        <section className="max-w-[1050px] mx-auto px-4 space-y-6">

          {/* Results heading */}
          <div className="flex items-center gap-3 anim-fade-up">
            <div className="w-1.5 h-6 rounded-full" style={{ background: 'var(--primary)' }} />
            <h2
              className="text-[17px] font-bold"
              style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
            >
              Train {trainNumber}
            </h2>
            <div
              className="text-[11px] font-bold px-3 py-0.5 rounded-full"
              style={{
                background: requests.length > 0 ? 'var(--success-bg)' : 'var(--bg-surface-2)',
                color: requests.length > 0 ? 'var(--success)' : 'var(--text-muted)',
                border: `1px solid ${requests.length > 0 ? 'var(--success)' : 'var(--border)'}`,
              }}
            >
              {requests.length} active swap {requests.length === 1 ? 'request' : 'requests'}
            </div>
          </div>

          {/* Disclaimer */}
          <div
            className="rounded-xl p-4 flex gap-3 items-start anim-fade-up anim-delay-1"
            style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-border)' }}
          >
            <AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '2px' }} />
            <p className="text-[12px] leading-relaxed font-medium" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--danger)' }}>Unofficial Board</strong> — Seat exchanges are mutual agreements
              and <strong style={{ color: 'var(--text-primary)' }}>will NOT update the IRCTC Railway Chart</strong>.
              Coordinate directly with co-passengers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ═══ Feed column ═══ */}
            <div className="lg:col-span-2">
              <div className="bp-card overflow-hidden anim-fade-up anim-delay-2">

                {/* Tab bar */}
                <div className="flex border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface-2)' }}>
                  {['feed', 'my'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="flex-1 py-3.5 text-[13px] font-bold uppercase transition-all duration-200"
                      style={{
                        color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                        borderBottom: activeTab === tab ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                        background: activeTab === tab ? 'var(--bg-surface)' : 'transparent',
                      }}
                    >
                      {tab === 'feed' ? 'Active Requests' : 'My Postings'}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div>
                  {activeTab === 'feed' ? (
                    requests.length > 0 ? (
                      requests.map((req, idx) => (
                        <div
                          key={req._id}
                          className={`p-5 flex flex-col sm:flex-row items-center justify-between gap-5 border-b last:border-0 transition-all duration-200 anim-fade-up anim-delay-${Math.min(idx + 3, 6)}`}
                          style={{ borderColor: 'var(--border-light)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--bg-hover)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                        >
                          <div className="flex items-start gap-4 w-full">
                            <div
                              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-[15px] font-bold"
                              style={{
                                background: 'var(--secondary-light)',
                                border: '1px solid var(--secondary)',
                                color: 'var(--secondary)',
                              }}
                            >
                              {req.user?.name ? req.user.name.charAt(0) : 'U'}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1 flex-wrap">
                                <p className="font-bold text-[15px]" style={{ color: 'var(--text-heading)' }}>{req.user?.name || 'Unknown User'}</p>
                                <span
                                  className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                                  style={{ color: 'var(--text-muted)', background: 'var(--bg-surface-2)' }}
                                >
                                  <Clock size={9} /> {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span
                                  className="text-[10px] font-bold px-2 py-0.5 rounded"
                                  style={{ color: 'var(--secondary)', background: 'var(--secondary-light)' }}
                                >
                                  Coach {req.coach}
                                </span>
                              </div>

                              <div
                                className="flex items-center gap-3 mt-2 p-2.5 rounded-lg w-fit"
                                style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-light)' }}
                              >
                                <div className="text-center px-2">
                                  <p className="text-[10px] uppercase font-bold mb-0.5" style={{ color: 'var(--text-muted)' }}>Has</p>
                                  <p className="text-[12px] font-bold" style={{ color: 'var(--text-primary)' }}>{req.currentSeat}</p>
                                </div>
                                <div
                                  className="w-7 h-7 rounded-full flex items-center justify-center"
                                  style={{ background: 'var(--primary-light)', border: '1px solid var(--primary)' }}
                                >
                                  <ArrowRightLeft size={12} style={{ color: 'var(--primary)' }} />
                                </div>
                                <div className="text-center px-2">
                                  <p className="text-[10px] uppercase font-bold mb-0.5" style={{ color: 'var(--text-muted)' }}>Needs</p>
                                  <p className="text-[12px] font-bold" style={{ color: 'var(--primary)' }}>{req.wantedSeat}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            className="bp-btn bp-btn--outline w-full sm:w-auto px-6 py-2.5 text-[13px] font-bold shrink-0"
                          >
                            Connect
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 flex flex-col items-center justify-center text-center anim-fade-up">
                        <Info size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                        <h3 className="font-bold text-[15px] mb-1" style={{ color: 'var(--text-heading)' }}>No Swap Requests</h3>
                        <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                          No one has posted a seat swap request for Train {trainNumber} yet. Be the first!
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="p-12 flex flex-col items-center justify-center text-center anim-fade-up">
                      <Info size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                      <h3 className="font-bold text-[15px] mb-1" style={{ color: 'var(--text-heading)' }}>No Postings Yet</h3>
                      <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>You haven't submitted any seat exchange requests.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ═══ Post Request sidebar ═══ */}
            <div className="bp-card h-fit sticky top-24 anim-fade-up anim-delay-3">
              <div
                className="px-6 py-4 border-b"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-surface-2)' }}
              >
                <h3
                  className="font-bold text-[15px] uppercase flex items-center gap-2 tracking-wide"
                  style={{ color: 'var(--text-heading)' }}
                >
                  <RefreshCcw size={16} style={{ color: 'var(--primary)' }} /> Post Swap Request
                </h3>
                <p className="text-[12px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                  For Train <strong style={{ color: 'var(--primary)' }}>{trainNumber}</strong>
                </p>
              </div>

              <form className="p-6 space-y-5" onSubmit={handlePost}>
                <div className="bp-input-wrapper">
                  <label className="bp-label">PNR Number</label>
                  <input
                    className="bp-input"
                    type="text"
                    placeholder="10-digit PNR"
                    value={myPnr}
                    onChange={(e) => setMyPnr(e.target.value)}
                    required
                  />
                </div>

                <div className="bp-input-wrapper">
                  <label className="bp-label">Your Current Seat</label>
                  <input
                    className="bp-input"
                    type="text"
                    placeholder="e.g. B4 | Seat 45 (Lower)"
                    value={mySeat}
                    onChange={(e) => setMySeat(e.target.value)}
                    required
                  />
                </div>

                <div className="bp-input-wrapper">
                  <label className="bp-label">Preferred Berth</label>
                  <select
                    className="bp-input"
                    style={{ cursor: 'pointer' }}
                    value={myTarget}
                    onChange={(e) => setMyTarget(e.target.value)}
                  >
                    <option>Upper Berth</option>
                    <option>Middle Berth</option>
                    <option>Lower Berth</option>
                    <option>Side Lower</option>
                    <option>Side Upper</option>
                  </select>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="bp-btn bp-btn--primary w-full py-3 text-[14px] font-bold uppercase tracking-wide flex items-center justify-center gap-2"
                    disabled={!myPnr || !mySeat}
                  >
                    <RefreshCcw size={15} />
                    POST REQUEST
                  </button>
                </div>

                {/* Success message */}
                {postSuccess && (
                  <div
                    className="flex items-center gap-2 p-3 rounded-lg text-[13px] font-semibold anim-scale-in"
                    style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)' }}
                  >
                    <CheckCircle2 size={16} /> Request posted successfully!
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      )}

      {/* ═══ Empty state — before search ═══ */}
      {!hasSearched && !isSearching && (
        <div className="max-w-[500px] mx-auto text-center py-16 px-4 anim-fade-up anim-delay-2">
          <div
            className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--primary-light)', border: '1px solid var(--border)' }}
          >
            <ArrowRightLeft size={28} style={{ color: 'var(--primary)' }} />
          </div>
          <h3
            className="text-lg font-bold mb-2"
            style={{ color: 'var(--text-heading)', fontFamily: "'Poppins', sans-serif" }}
          >
            Find seat swap partners
          </h3>
          <p className="text-[14px] mb-4" style={{ color: 'var(--text-secondary)' }}>
            Enter your train number above to browse active swap requests from co-passengers on the same train.
          </p>
          <div
            className="flex items-center gap-2 mx-auto w-fit px-4 py-2 rounded-lg text-[12px] font-semibold"
            style={{ background: 'var(--bg-surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            <Info size={14} />
            Both passengers must be on the same train
          </div>
        </div>
      )}
    </div>
  );
}
