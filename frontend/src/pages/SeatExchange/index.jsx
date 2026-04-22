import { useState, useEffect } from 'react';
import {
  User, RefreshCcw, AlertTriangle, ArrowRightLeft,
  Clock, Info, Search, Train, CheckCircle2, XCircle,
  MessageSquare, Send, ChevronDown, ChevronUp, FileText, Frown
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
  const [expandedReq, setExpandedReq] = useState(null);
  const [reqMessages, setReqMessages] = useState({});

  const requests = hasSearched
    ? allRequests.filter(req => req.trainNumber === trainNumber)
    : [];

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
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
    <main className="min-h-screen pt-[120px] pb-[80px]">
      <div className="container anim-slide-down">
        
        {/* ═══ Hero Header ═══ */}
        <section className="hero" style={{ textAlign: 'center', padding: '0 0 60px', maxWidth: '800px', margin: '0 auto' }}>
          <h1 className="hero-h1">
            P2P <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Seat</span> Exchange
          </h1>
          <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '18px', lineHeight: '1.6' }}>
            Find co-passengers on the same train and negotiate seat swaps instantly. Connect directly, with complete privacy.
          </p>
        </section>

        {/* ═══ Search Section ═══ */}
        <section className="search-section" style={{ maxWidth: '700px', margin: '0 auto 60px' }}>
          <div className="search-tabs">
            <button className="search-tab active">Find Swap Partners</button>
          </div>
          <div className="tab-content active anim-fade-in">
            <form className="search-form" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} onSubmit={handleSearch}>
              <div className="form-group full-width">
                <label>Train Number</label>
                <div style={{ position: 'relative' }}>
                  <Train size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="premium-input bg-surface"
                    placeholder="e.g. 12952"
                    value={trainNumber}
                    onChange={(e) => setTrainNumber(e.target.value)}
                    required
                    style={{
                      width: '100%', padding: '16px 20px 16px 48px', fontSize: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border)', borderRadius: '12px',
                      color: 'var(--text-primary)', outline: 'none', transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="bp-btn bp-btn--primary" 
                disabled={!trainNumber.trim() || isSearching}
                style={{ padding: '16px', fontSize: '16px', borderRadius: '12px' }}
              >
                {isSearching ? <span className="flex items-center gap-2"><RefreshCcw className="animate-spin" size={18} /> Searching...</span> : 'Find Swaps'}
              </button>
            </form>
          </div>
        </section>

        {/* ═══ Results Section (ONLY shown after search) ═══ */}
        {hasSearched && (
          <section className="results-section anim-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* ═══ Feed Column ═══ */}
              <div className="lg:col-span-2">
                
                {/* Embedded Tabs for Feed vs My Postings */}
                <div className="search-tabs" style={{ marginBottom: '32px' }}>
                  <button 
                    className={`search-tab ${activeTab === 'feed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('feed')}
                  >
                    Active Requests ({requests.length})
                  </button>
                  <button 
                    className={`search-tab ${activeTab === 'my' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my')}
                  >
                    My Postings
                  </button>
                </div>

                {activeTab === 'feed' ? (
                  requests.length > 0 ? (
                    requests.map((req) => (
                      <div key={req._id} className="train-card bp-hover-lift">
                        <div className="train-header">
                          <div className="train-info">
                            <h3 style={{ fontFamily: 'var(--font-sora)' }}>
                              {req.user?.name || 'Passenger'}
                            </h3>
                            <span className="train-number" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Clock size={14} /> Coach {req.coach} • {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {user?._id !== req.user?._id ? (
                            <button
                              className="bp-btn bp-btn--outline"
                              onClick={() => {
                                if (!user) return alert('Please login to connect');
                                setSelectedReq(req);
                              }}
                            >
                              Connect
                            </button>
                          ) : (
                            <span className="status-badge on-time" style={{ background: 'var(--bg-active)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>
                              Your Post
                            </span>
                          )}
                        </div>

                        <div className="train-route" style={{ marginTop: '30px', display: 'flex', alignItems: 'center' }}>
                          <div className="station" style={{ flex: 1 }}>
                            <div className="station-name text-2xl" style={{ fontFamily: "'DM Serif Display', serif" }}>
                              {req.currentSeat}
                            </div>
                            <div className="station-time uppercase font-semibold text-xs tracking-wider" style={{ color: 'var(--text-muted)' }}>Has</div>
                          </div>
                          <div className="route-line" style={{ flex: 1.5, position: 'relative', height: '2px', background: 'var(--border)' }}>
                            <ArrowRightLeft size={16} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-surface)', padding: '0 4px', color: 'var(--text-muted)' }} />
                          </div>
                          <div className="station" style={{ flex: 1, textAlign: 'right' }}>
                            <div className="station-name text-2xl" style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--primary)' }}>
                              {req.wantedSeat}
                            </div>
                            <div className="station-time uppercase font-semibold text-xs tracking-wider" style={{ color: 'var(--text-muted)' }}>Needs</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed var(--border)', borderRadius: '16px', color: 'var(--text-muted)' }}>
                      <Search size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                      <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>No Swap Requests</h3>
                      <p>No one has posted a seat swap request for Train {trainNumber} yet.</p>
                    </div>
                  )
                ) : (
                  /* ═══ My Postings View ═══ */
                  myRequests.length > 0 ? (
                    myRequests.map((req) => (
                      <div key={req._id} className="train-card bp-hover-lift" style={{ padding: '24px' }}>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span style={{ display: 'inline-block', background: 'var(--bg-active)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', marginBottom: '8px' }}>
                              {req.status.toUpperCase()} • TRAIN {req.trainNumber}
                            </span>
                            <div className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                              Swapping <strong style={{ color: 'var(--text-primary)' }}>{req.currentSeat}</strong> for <strong style={{ color: 'var(--primary)' }}>{req.wantedSeat}</strong>
                            </div>
                          </div>
                          <button 
                            onClick={() => setExpandedReq(expandedReq === req._id ? null : req._id)}
                            className="bp-btn bp-btn--secondary flex items-center gap-2"
                            style={{ padding: '8px 16px' }}
                          >
                            <MessageSquare size={16} /> 
                            {reqMessages[req._id]?.length || 0}
                          </button>
                        </div>
                        
                        {/* Messages Dropdown */}
                        {expandedReq === req._id && (
                          <div className="mt-4 pt-4 border-t border-[var(--border)]">
                            {reqMessages[req._id]?.length > 0 ? (
                              <div className="space-y-4">
                                {reqMessages[req._id].map((m, mIdx) => (
                                  <div key={mIdx} className={`flex flex-col ${m.sender._id === user._id ? 'items-end' : 'items-start'}`}>
                                    <div 
                                      style={{
                                        background: m.sender._id === user._id ? 'rgba(255,107,0,0.1)' : 'var(--bg-input)',
                                        border: `1px solid ${m.sender._id === user._id ? 'var(--primary-glow)' : 'var(--border)'}`,
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        maxWidth: '80%'
                                      }}
                                    >
                                      <p className="text-xs uppercase font-semibold opacity-60 mb-1" style={{ color: m.sender._id === user._id ? 'var(--primary)' : 'var(--text-secondary)' }}>{m.sender.name}</p>
                                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{m.text}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div style={{ textAlign: 'center', padding: '24px', opacity: 0.6 }}>
                                <FileText size={32} style={{ margin: '0 auto 8px' }} />
                                <p className="text-sm">No messages yet.</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed var(--border)', borderRadius: '16px', color: 'var(--text-muted)' }}>
                      <FileText size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                      <h3 style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>No Postings Yet</h3>
                      <p>You haven't submitted any seat exchange requests.</p>
                    </div>
                  )
                )}
              </div>

              {/* ═══ Post Request Sidebar ═══ */}
              <div className="lg:col-span-1">
                <div className="search-section" style={{ position: 'sticky', top: '100px', padding: '32px' }}>
                  <div className="mb-6 pb-4 border-b border-[var(--border)]">
                     <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>Post Request</h3>
                     <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>For Train <strong>{trainNumber}</strong></p>
                  </div>

                  <form className="search-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handlePost}>
                    <div className="form-group">
                      <label>PNR Number</label>
                      <input
                        type="text"
                        placeholder="10-digit PNR"
                        value={myPnr}
                        onChange={(e) => setMyPnr(e.target.value)}
                        required
                        style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                      />
                    </div>
                    <div className="form-group">
                      <label>Your Current Seat</label>
                      <input
                        type="text"
                        placeholder="e.g. B4 | 45"
                        value={mySeat}
                        onChange={(e) => setMySeat(e.target.value)}
                        required
                        style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)', outline: 'none' }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                      />
                    </div>
                    <div className="form-group">
                      <label>Current Berth</label>
                      <select 
                        value={myCurrentBerth} 
                        onChange={(e) => setMyCurrentBerth(e.target.value)}
                        style={{ padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                      >
                        <option>Upper Berth</option>
                        <option>Middle Berth</option>
                        <option>Lower Berth</option>
                        <option>Side Lower</option>
                        <option>Side Upper</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Preferred Berth</label>
                      <select 
                        value={myTarget} 
                        onChange={(e) => setMyTarget(e.target.value)}
                        style={{ padding: '12px 16px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                      >
                        <option>Upper Berth</option>
                        <option>Middle Berth</option>
                        <option>Lower Berth</option>
                        <option>Side Lower</option>
                        <option>Side Upper</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="bp-btn bp-btn--primary"
                      disabled={!myPnr || !mySeat}
                      style={{ marginTop: '8px' }}
                    >
                      Post Request
                    </button>
                    {postSuccess && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold" style={{ color: 'var(--success)', background: 'var(--success-bg)', padding: '12px', borderRadius: '8px' }}>
                        <CheckCircle2 size={16} /> Successfully Posted!
                      </div>
                    )}
                  </form>
                </div>
              </div>

            </div>
          </section>
        )}

      </div>

      {/* ═══ Message Modal ═══ */}
      {selectedReq && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="train-card anim-scale-in" style={{ width: '100%', maxWidth: '450px', margin: 0, padding: '32px' }}>
            <div className="flex justify-between items-center mb-6 border-b border-[var(--border)] pb-4">
              <h3 className="text-xl font-semibold font-serif" style={{ color: 'var(--text-heading)' }}>Message Passenger</h3>
              <button 
                onClick={() => setSelectedReq(null)}
                className="bp-icon-hover"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '50%', padding: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="form-group full-width mb-6">
              <label>Your Message</label>
              <textarea 
                placeholder="Hi! I am interested in swapping seats..."
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                rows={4}
                style={{
                  width: '100%', padding: '16px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)', borderRadius: '12px',
                  color: 'var(--text-primary)', outline: 'none', resize: 'none',
                  fontSize: '15px'
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <button 
              onClick={handleSendMessage}
              disabled={isSending || !msgText.trim()}
              className="bp-btn bp-btn--primary w-full flex justify-center items-center gap-2"
              style={{ padding: '14px', fontSize: '16px' }}
            >
              {isSending ? 'Sending...' : <><Send size={18} /> Send Message</>}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
