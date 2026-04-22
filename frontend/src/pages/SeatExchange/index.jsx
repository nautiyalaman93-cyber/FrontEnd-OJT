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
    <main className="min-h-screen">
      <div className="container anim-slide-down">
        
        {/* ═══ Hero Header ═══ */}
        <section className="hero" style={{ textAlign: 'left', padding: '60px 0 40px' }}>
          <h1 className="hero-h1">
            P2P <span style={{ color: 'var(--accent-primary)', fontStyle: 'italic' }}>Seat</span> Exchange
          </h1>
          <p style={{ margin: '0' }}>
            Find co-passengers on the same train and negotiate seat swaps instantly. Connect directly, with privacy.
          </p>
        </section>

        {/* ═══ Search Section ═══ */}
        <section className="search-section">
          <div className="search-tabs">
            <button className="search-tab active">Find Swap Partners</button>
          </div>
          <div className="tab-content active anim-fade-in">
            <form className="search-form" onSubmit={handleSearch}>
              <div className="form-group full-width">
                <label>Train Number</label>
                <input
                  type="text"
                  placeholder="e.g. 12952"
                  value={trainNumber}
                  onChange={(e) => setTrainNumber(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={!trainNumber.trim() || isSearching}
              >
                {isSearching ? 'Searching…' : 'FIND SWAPS'}
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
                <div className="search-tabs" style={{ marginBottom: '24px' }}>
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
                      <div key={req._id} className="train-card">
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
                              className="filter-btn"
                              style={{ border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}
                              onClick={() => {
                                if (!user) return alert('Please login to connect');
                                setSelectedReq(req);
                              }}
                            >
                              Connect
                            </button>
                          ) : (
                            <span className="status-badge on-time" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                              Your Post
                            </span>
                          )}
                        </div>

                        <div className="train-route" style={{ marginTop: '30px' }}>
                          <div className="station">
                            <div className="station-name text-2xl" style={{ fontFamily: "'DM Serif Display', serif" }}>
                              {req.currentSeat}
                            </div>
                            <div className="station-time uppercase font-semibold text-xs tracking-wider">Has</div>
                          </div>
                          <div className="route-line"></div>
                          <div className="station" style={{ textAlign: 'right' }}>
                            <div className="station-name text-2xl" style={{ fontFamily: "'DM Serif Display', serif", color: 'var(--accent-primary)' }}>
                              {req.wantedSeat}
                            </div>
                            <div className="station-time uppercase font-semibold text-xs tracking-wider">Needs</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state-icon text-4xl mb-4">≡ƒÿö</div>
                      <h3>No Swap Requests</h3>
                      <p>No one has posted a seat swap request for Train {trainNumber} yet.</p>
                    </div>
                  )
                ) : (
                  /* ═══ My Postings View ═══ */
                  myRequests.length > 0 ? (
                    myRequests.map((req) => (
                      <div key={req._id} className="train-card" style={{ padding: '24px' }}>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className={`status-badge ${req.status === 'open' ? 'on-time' : 'delayed'}`}>
                              {req.status.toUpperCase()} • TRAIN {req.trainNumber}
                            </span>
                            <div className="mt-3 text-lg" style={{ color: 'var(--text-secondary)' }}>
                              Swapping <strong style={{ color: 'var(--text-primary)' }}>{req.currentSeat}</strong> for <strong style={{ color: 'var(--accent-primary)' }}>{req.wantedSeat}</strong>
                            </div>
                          </div>
                          <button 
                            onClick={() => setExpandedReq(expandedReq === req._id ? null : req._id)}
                            className="filter-btn flex items-center gap-2"
                            style={{ padding: '8px 16px' }}
                          >
                            <MessageSquare size={16} /> 
                            {reqMessages[req._id]?.length || 0}
                          </button>
                        </div>
                        
                        {/* Messages Dropdown */}
                        {expandedReq === req._id && (
                          <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                            {reqMessages[req._id]?.length > 0 ? (
                              <div className="space-y-4">
                                {reqMessages[req._id].map((m, mIdx) => (
                                  <div key={mIdx} className={`flex flex-col ${m.sender._id === user._id ? 'items-end' : 'items-start'}`}>
                                    <div 
                                      style={{
                                        background: m.sender._id === user._id ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
                                        border: '1px solid var(--border-color)',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        maxWidth: '80%'
                                      }}
                                    >
                                      <p className="text-xs uppercase font-semibold opacity-60 mb-1">{m.sender.name}</p>
                                      <p className="text-sm">{m.text}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>No messages yet.</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <div className="empty-state-icon">≡ƒôä</div>
                      <h3>No Postings Yet</h3>
                      <p>You haven't submitted any seat exchange requests.</p>
                    </div>
                  )
                )}
              </div>

              {/* ═══ Post Request Sidebar ═══ */}
              <div className="lg:col-span-1">
                <div className="search-section" style={{ position: 'sticky', top: '100px', padding: '32px' }}>
                  <div className="mb-6 pb-4 border-b border-[var(--border-color)]">
                     <h3 className="text-xl font-semibold mb-1">Post Request</h3>
                     <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>For Train <strong>{trainNumber}</strong></p>
                  </div>

                  <form className="search-form" style={{ gridTemplateColumns: '1fr' }} onSubmit={handlePost}>
                    <div className="form-group">
                      <label>PNR Number</label>
                      <input
                        type="text"
                        placeholder="10-digit PNR"
                        value={myPnr}
                        onChange={(e) => setMyPnr(e.target.value)}
                        required
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
                      />
                    </div>
                    <div className="form-group">
                      <label>Current Berth</label>
                      <select value={myCurrentBerth} onChange={(e) => setMyCurrentBerth(e.target.value)}>
                        <option>Upper Berth</option>
                        <option>Middle Berth</option>
                        <option>Lower Berth</option>
                        <option>Side Lower</option>
                        <option>Side Upper</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Preferred Berth</label>
                      <select value={myTarget} onChange={(e) => setMyTarget(e.target.value)}>
                        <option>Upper Berth</option>
                        <option>Middle Berth</option>
                        <option>Lower Berth</option>
                        <option>Side Lower</option>
                        <option>Side Upper</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={!myPnr || !mySeat}
                    >
                      POST REQUEST
                    </button>
                    {postSuccess && (
                      <div className="status-badge on-time text-center mt-4">
                        Successfully Posted!
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
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="train-card" style={{ width: '100%', maxWidth: '450px', margin: 0, padding: '32px' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Message Passenger</h3>
              <button 
                onClick={() => setSelectedReq(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="form-group full-width mb-6">
              <label>Your Message</label>
              <textarea 
                placeholder="Hi! I am interested in swapping seats..."
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                rows={4}
              />
            </div>
            <button 
              onClick={handleSendMessage}
              disabled={isSending || !msgText.trim()}
              className="btn-primary"
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
