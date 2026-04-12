/**
 * @file index.jsx (Seat Exchange Page)
 * @description P2P seat swap board — train-based, search-first, theme-aware, animated.
 * Both passengers must be on the same train, so train number is required first.
 */

import { useState, useEffect } from 'react';
import {
  User, RefreshCcw, AlertTriangle, ArrowRightLeft,
  Clock, Info, Search, Train, CheckCircle2, XCircle,
  MessageSquare, Send, ChevronDown, ChevronUp
} from 'lucide-react';

import { seatService } from '../../services/seatService';
import { useAuth } from '../../context/AuthContext';

export default function SeatExchange() {
  const { user } = useAuth();
  const [trainNumber, setTrainNumber] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('feed');

  /* ── Messaging state ── */
  const [selectedReq, setSelectedReq] = useState(null);
  const [msgText, setMsgText] = useState('');
  const [isSending, setIsSending] = useState(false);

  /* ── Form state ── */
  const [myPnr, setMyPnr] = useState('');
  const [mySeat, setMySeat] = useState('');
  const [myTarget, setMyTarget] = useState('Upper Berth');
  const [postSuccess, setPostSuccess] = useState(false);

  const [allRequests, setAllRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [expandedReq, setExpandedReq] = useState(null); // For viewing messages in 'my' tab
  const [reqMessages, setReqMessages] = useState({}); // { requestId: [messages] }

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

  const fetchMyRequests = async () => {
    if (!user) return;
    try {
      const data = await seatService.getMyRequests();
      setMyRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'my') fetchMyRequests();
  }, [activeTab, user]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to post a swap request');
      return;
    }
    if (!myPnr || !mySeat) return;
    
    try {
      const coachValue = mySeat.split('|')[0]?.trim() || 'Unknown';
      await seatService.submitRequest({
        trainNumber,
        journeyDate: new Date().toISOString().split('T')[0],
        coach: coachValue,
        currentSeat: mySeat,
        wantedSeat: myTarget
      });
      
      setPostSuccess(true);
      setMyPnr('');
      setMySeat('');
      handleSearch();
      setTimeout(() => setPostSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to post swap request', err);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedReq || !msgText.trim()) return;
    setIsSending(true);
    try {
      await seatService.sendMessage(selectedReq._id, msgText);
      setSelectedReq(null);
      setMsgText('');
      alert('Message sent successfully! The passenger will see it in their inbox.');
    } catch (err) {
      console.error(err);
      alert('Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  const loadMessages = async (reqId) => {
    try {
      const data = await seatService.getMessages(reqId);
      setReqMessages(prev => ({ ...prev, [reqId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (expandedReq) loadMessages(expandedReq);
  }, [expandedReq]);

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
                            onClick={() => {
                              if (!user) return alert('Please login to connect');
                              setSelectedReq(req);
                            }}
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
                    /* ═══ My Postings View ═══ */
                    myRequests.length > 0 ? (
                      myRequests.map((req, idx) => (
                        <div key={req._id} className="border-b last:border-0" style={{ borderColor: 'var(--border-light)' }}>
                          <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                                  Train {req.trainNumber}
                                </span>
                                <span 
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${req.status === 'open' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}
                                >
                                  {req.status}
                                </span>
                              </div>
                              <p className="text-[13px] font-semibold text-slate-500">
                                Swapping <span className="text-slate-900 dark:text-white">{req.currentSeat}</span> for <span className="text-orange-500">{req.wantedSeat}</span>
                              </p>
                            </div>
                            <button 
                              onClick={() => setExpandedReq(expandedReq === req._id ? null : req._id)}
                              className="flex items-center gap-2 text-[12px] font-bold text-orange-500 hover:opacity-80 p-2"
                            >
                              <MessageSquare size={16} />
                              {reqMessages[req._id]?.length || 0} Messages
                              {expandedReq === req._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </div>
                          
                          {/* Messages dropdown for My Postings */}
                          {expandedReq === req._id && (
                            <div className="px-5 pb-5 pt-0 anim-fade-up">
                              <div className="p-4 rounded-xl space-y-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                                {reqMessages[req._id]?.length > 0 ? (
                                  reqMessages[req._id].map((m, mIdx) => (
                                    <div key={mIdx} className={`flex flex-col ${m.sender._id === user._id ? 'items-end' : 'items-start'}`}>
                                      <div 
                                        className={`max-w-[80%] p-3 rounded-2xl text-[12px] ${m.sender._id === user._id ? 'bg-orange-500 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none'}`}
                                      >
                                        <p className="font-bold text-[10px] mb-1 opacity-75">{m.sender.name}</p>
                                        <p>{m.text}</p>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-center text-[11px] text-slate-500 italic py-4">No messages yet.</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-12 flex flex-col items-center justify-center text-center anim-fade-up">
                        <Info size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                        <h3 className="font-bold text-[15px] mb-1" style={{ color: 'var(--text-heading)' }}>No Postings Yet</h3>
                        <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>You haven't submitted any seat exchange requests.</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* ═══ Message Modal ═══ */}
            {selectedReq && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm anim-fade-in">
                <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden anim-scale-in">
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
                        <MessageSquare size={16} />
                      </div>
                      <h3 className="font-bold text-[15px] dark:text-white">Message {selectedReq.user.name}</h3>
                    </div>
                    <button onClick={() => setSelectedReq(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500">
                      <XCircle size={20} />
                    </button>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Current</p>
                        <p className="text-[12px] font-bold text-slate-700 dark:text-slate-300">{selectedReq.currentSeat}</p>
                      </div>
                      <ArrowRightLeft size={14} className="text-orange-500" />
                      <div className="text-center">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Wanted</p>
                        <p className="text-[12px] font-bold text-orange-500">{selectedReq.wantedSeat}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-1">Your Message</label>
                      <textarea 
                        className="w-full h-32 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-orange-500 dark:focus:border-orange-500 outline-none text-[14px] text-slate-800 dark:text-slate-200 transition-all"
                        placeholder="Hi! I am interested in swapping seats. I have a B2 | 24 (Lower) seat..."
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={handleSendMessage}
                      disabled={isSending || !msgText.trim()}
                      className="w-full bp-btn bp-btn--primary py-3.5 flex items-center justify-center gap-2 text-[14px] font-bold uppercase"
                    >
                      {isSending ? 'Sending...' : <><Send size={16}/> Send Message</>}
                    </button>
                    <p className="text-[10px] text-center mt-3 text-slate-400 font-medium">
                      Privacy First: Your phone number and email will NOT be shared.
                    </p>
                  </div>
                </div>
              </div>
            )}

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
