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
  const [myCurrentBerth, setMyCurrentBerth] = useState('Lower Berth');
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
      const data = await seatService.getRequests(trainNumber);
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
        currentSeat: `${mySeat.trim()} (${myCurrentBerth})`,
        wantedSeat: myTarget
      });
      
      setPostSuccess(true);
      setMyPnr('');
      setMySeat('');
      setMyCurrentBerth('Lower Berth');
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
        className="py-10 mb-8 border-b anim-fade-in relative overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 shadow-sm"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-[1050px] mx-auto px-4 anim-slide-left relative z-10">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/30"
            >
              <ArrowRightLeft size={22} className="text-white" />
            </div>
            <div>
              <h1
                className="text-2xl font-extrabold tracking-tight"
                style={{ color: 'var(--text-heading)', fontFamily: "'Inter', sans-serif" }}
              >
                P2P Seat Exchange
              </h1>
              <p className="text-[14px] font-medium opacity-80" style={{ color: 'var(--text-secondary)' }}>
                Find co-passengers on the same train and negotiate seat swaps instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Search Card — Train Number ═══ */}
      <section className="max-w-[1050px] mx-auto px-4 mb-10">
        <div className="p-6 anim-fade-up backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 shadow-xl border border-white/20 dark:border-slate-700/50 rounded-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl translate-y-1/2" />
          
          <div className="flex flex-col sm:flex-row items-end gap-5 relative z-10">
            <div className="flex-1 w-full">
              <label className="text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">Train Number</label>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20"
                >
                  <Train size={20} className="text-orange-500" />
                </div>
                <input
                  className="bp-input flex-1 h-12 text-lg font-bold bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all rounded-xl"
                  type="text"
                  placeholder="e.g. 12952"
                  value={trainNumber}
                  onChange={(e) => setTrainNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <p className="text-[11px] mt-2 font-medium" style={{ color: 'var(--text-muted)' }}>
                Both passengers must be on the same train for seat exchange.
              </p>
            </div>
            <button
              className="h-12 px-8 text-[14px] font-bold uppercase tracking-wide flex items-center justify-center gap-2 shrink-0 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSearch}
              disabled={!trainNumber.trim() || isSearching}
            >
              <Search size={18} />
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
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </div>
            <h2
              className="text-[18px] font-extrabold tracking-tight"
              style={{ color: 'var(--text-heading)' }}
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
                          className={`relative p-0 flex flex-col sm:flex-row items-stretch justify-between gap-0 mb-6 transition-all duration-300 anim-fade-up anim-delay-${Math.min(idx + 3, 6)} bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-slate-200 dark:border-slate-700 overflow-hidden group`}
                        >
                          {/* Ticket Left Section */}
                          <div className="flex-1 p-5 border-b sm:border-b-0 sm:border-r-2 border-dashed border-slate-200 dark:border-slate-700 flex items-start gap-4 w-full relative bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80">
                            {/* Cut-out semi circles for ticket effect */}
                            <div className="hidden sm:block absolute -top-3 -right-3 w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-900 border-b border-l border-slate-200 dark:border-slate-700" style={{ zIndex: 2 }} />
                            <div className="hidden sm:block absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-slate-50 dark:bg-slate-900 border-t border-l border-slate-200 dark:border-slate-700" style={{ zIndex: 2 }} />
                            
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-[16px] font-extrabold bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-600 dark:text-slate-300 shadow-inner"
                            >
                              {req.user?.name ? req.user.name.charAt(0) : 'U'}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <p className="font-extrabold text-[16px]" style={{ color: 'var(--text-heading)' }}>{req.user?.name || 'Unknown User'}</p>
                                <span
                                  className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                                >
                                  <Clock size={10} /> {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span
                                  className="text-[10px] font-bold px-2.5 py-1 rounded shadow-sm bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800"
                                >
                                  Coach {req.coach}
                                </span>
                              </div>

                              <div
                                className="flex items-center justify-between gap-3 mt-3 p-3 rounded-xl w-full max-w-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700"
                              >
                                <div className="text-left px-2">
                                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Has</p>
                                  <p className="text-[14px] font-extrabold text-slate-700 dark:text-slate-200">{req.currentSeat}</p>
                                </div>
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-500 shadow-md shadow-orange-500/20 group-hover:rotate-180 transition-transform duration-500"
                                >
                                  <ArrowRightLeft size={14} className="text-white" />
                                </div>
                                <div className="text-right px-2">
                                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Needs</p>
                                  <p className="text-[14px] font-extrabold text-orange-500">{req.wantedSeat}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Ticket Right Section (Action) */}
                          <div className="w-full sm:w-48 p-5 flex items-center justify-center bg-slate-50/50 dark:bg-slate-800/30">
                            {user?._id !== req.user?._id ? (
                              <button
                                className="w-full py-3.5 px-4 rounded-xl text-[13px] font-bold uppercase tracking-wide bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-xl shadow-slate-900/10 transition-all hover:scale-105"
                                onClick={() => {
                                  if (!user) return alert('Please login to connect');
                                  setSelectedReq(req);
                                }}
                              >
                                Connect
                              </button>
                            ) : (
                              <span className="text-[12px] font-bold text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl px-5 py-3 text-center uppercase tracking-wider w-full">Your Request</span>
                            )}
                          </div>
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
            <div className="h-fit sticky top-24 anim-fade-up anim-delay-3">
              <div className="rounded-2xl overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 shadow-2xl border border-slate-200/80 dark:border-slate-700/80">
                <div
                  className="px-6 py-5 bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                >
                  <h3
                    className="font-extrabold text-[16px] uppercase flex items-center gap-2 tracking-wider"
                  >
                    <RefreshCcw size={18} /> Post Swap Request
                  </h3>
                  <p className="text-[13px] mt-1.5 opacity-90 font-medium">
                    For Train <strong>{trainNumber}</strong>
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
                    placeholder="e.g. B4 | 45"
                    value={mySeat}
                    onChange={(e) => setMySeat(e.target.value)}
                    required
                  />
                </div>

                <div className="bp-input-wrapper">
                  <label className="bp-label">Current Berth</label>
                  <select
                    className="bp-input"
                    style={{ cursor: 'pointer' }}
                    value={myCurrentBerth}
                    onChange={(e) => setMyCurrentBerth(e.target.value)}
                  >
                    <option>Upper Berth</option>
                    <option>Middle Berth</option>
                    <option>Lower Berth</option>
                    <option>Side Lower</option>
                    <option>Side Upper</option>
                  </select>
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
