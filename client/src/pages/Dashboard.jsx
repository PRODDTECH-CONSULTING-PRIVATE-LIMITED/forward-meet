import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car, Train, Coffee, UtensilsCrossed, Building2,
  ArrowRightLeft, CalendarDays, ChevronDown, ArrowRight,
  Clock, SlidersHorizontal, Calendar, Navigation, MapPin
} from 'lucide-react';
import './dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [travelMode, setTravelMode] = useState('driving');
  const [placeType, setPlaceType] = useState('coffee');
  const [activeTab, setActiveTab] = useState('time');
  const [loc1, setLoc1] = useState('');
  const [loc2, setLoc2] = useState('');

  const handleFindMidway = () => {
    if (!loc1.trim() || !loc2.trim()) return;
    
    // Map Dashboard filter pill ids to backend/App.jsx expects
    const venueMap = { coffee: 'cafe', dining: 'restaurant', coworking: 'coworking_space' };
    const mappedPlaceType = venueMap[placeType] || 'restaurant';

    const params = new URLSearchParams({
      loc1: loc1.trim(),
      loc2: loc2.trim(),
      travelMode: travelMode,
      placeType: mappedPlaceType
    });
    
    navigate(`/venues?${params.toString()}`);
  };

  const pills = [
    { id: 'driving', label: 'Driving', icon: Car },
    { id: 'transit', label: 'Transit', icon: Train },
    { id: 'coffee', label: 'Coffee', icon: Coffee },
    { id: 'dining', label: 'Dining', icon: UtensilsCrossed },
    { id: 'coworking', label: 'Coworking', icon: Building2 },
  ];

  const features = [
    {
      icon: Clock,
      title: 'Time-Aware Routing',
      desc: 'Aggregates real-time traffic telemetry and transit logistics for accurate synchronization.',
    },
    {
      icon: SlidersHorizontal,
      title: 'Vibe Filtering',
      desc: 'Categorical classification of venues by professional utility and acoustic profile.',
    },
    {
      icon: Calendar,
      title: 'Instant Calendar Invite',
      desc: 'Automated ICS generation and direct calendar integration for streamlined scheduling.',
    },
  ];

  return (
    <div className="dashboard-page">
      {/* ─── Navbar ─── */}
      <nav className="dash-nav">
          {/* <a href="#how">How it Works</a> */}
           <div className="dash-nav-logo">How it Works</div>
        <div className="dash-nav-links">
        <div className="dash-nav-logo">Midway</div>
        </div>
        <div className="dash-nav-right">
          <a href="#pricing">We are meeting</a>
          <a href="#pricing">Group Meet</a>
          <a href="#corporate">I am travelling</a>
          {/* <button className="dash-nav-signin">Sign In</button> */}
          {/* <button className="dash-nav-cta">Create Account</button> */}
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="dash-hero">
        <h1>Meetings made <span>equidistant</span>.</h1>
        <p>Optimized coordinate calculation for professional rendezvous based on travel time and transit logistics.</p>

        {/* Search Bar */}
        <div className="dash-search">
          {/* Start Point A */}
          <div className="dash-search-field">
            <Navigation className="field-icon" size={18} />
            <div className="field-input">
              <span className="field-label">Start Point A</span>
              <input
                className="field-input-text"
                type="text"
                placeholder="Address, City or Zip"
                value={loc1}
                onChange={e => setLoc1(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFindMidway()}
              />
            </div>
          </div>

          {/* Swap Button */}
          <button 
            className="dash-search-swap" 
            title="Swap locations"
            onClick={() => { const temp = loc1; setLoc1(loc2); setLoc2(temp); }}
          >
            <span className="swap-icon">⇄</span>
          </button>

          {/* Start Point B */}
          <div className="dash-search-field">
            <MapPin className="field-icon" size={18} />
            <div className="field-input">
              <span className="field-label">Start Point B</span>
              <input
                className="field-input-text"
                type="text"
                placeholder="Address, City or Zip"
                value={loc2}
                onChange={e => setLoc2(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFindMidway()}
              />
            </div>
          </div>

          <div className="dash-search-divider" />

          {/* Schedule */}
          <div className="dash-search-schedule">
            <CalendarDays className="field-icon" size={18} />
            <div className="field-input">
              <span className="field-label">Schedule</span>
              <span className="field-placeholder" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                Now
                <ChevronDown size={14} style={{ color: '#aaa' }} />
              </span>
            </div>
          </div>

          {/* Find Midway Button */}
          <button 
            className="dash-search-btn" 
            onClick={handleFindMidway}
            disabled={!loc1.trim() || !loc2.trim()}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="white"/>
              <path d="M14.5 9.5L10.5 10.5L9.5 14.5L13.5 13.5L14.5 9.5Z" fill="#0052cc" />
              <circle cx="12" cy="12" r="1" fill="white" />
            </svg>
            Find Midway
          </button>
        </div>
      </section>

      {/* ─── Filter Pills ─── */}
      <div className="dash-pills-section">
        {/* Part 1: Transport mode segmented control */}
        <div className="dash-pills-segment">
          {[{ id: 'driving', label: 'Driving', Icon: Car }, { id: 'transit', label: 'Transit', Icon: Train }].map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`dash-pill-seg ${travelMode === id ? 'active' : ''}`}
              onClick={() => setTravelMode(id)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Part 2: Venue category individual pills */}
        <div className="dash-pills-venues">
          {[{ id: 'coffee', label: 'Coffee', Icon: Coffee }, { id: 'dining', label: 'Dining', Icon: UtensilsCrossed }, { id: 'coworking', label: 'Coworking', Icon: Building2 }].map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`dash-pill-venue ${placeType === id ? 'active' : ''}`}
              onClick={() => setPlaceType(id)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Editor's Picks ─── */}
      <section className="dash-picks">
        <div className="dash-picks-header">
          <h2>Editor&apos;s Picks</h2>
          <a href="#all">View all locations <ArrowRight size={16} /></a>
        </div>
        <div className="dash-picks-underline" />
        <p className="dash-picks-sub">Structured recommendations for high-efficiency collaboration.</p>

        {/* Top Row — 2 large cards */}
        <div className="dash-cards-top">
          <div className="dash-card dash-card-large">
            <img src="/images/glass_conservatory.png" alt="The Glass Conservatory" />
            <div className="dash-card-overlay">
              <div className="dash-card-badge top-rated">Top Rated</div>
              <div className="dash-card-rating">★ 4.9 (120 reviews)</div>
              <div className="dash-card-title">The Glass Conservatory</div>
              <div className="dash-card-desc">An architectural marvel featuring botanical displays and locally-sourced specialty coffee. Perfect for creative brainstorming.</div>
            </div>
          </div>
          <div className="dash-card dash-card-large">
            <img src="/images/nexus_hub.png" alt="Nexus Hub" />
            <div className="dash-card-overlay">
              <div className="dash-card-title">Nexus Hub</div>
              <div className="dash-card-desc">Quiet, high-speed connectivity with premium espresso service.</div>
            </div>
          </div>
        </div>

        {/* Bottom Row — 3 small cards */}
        <div className="dash-cards-bottom">
          <div className="dash-card dash-card-small">
            <img src="/images/gilded_rail.png" alt="The Gilded Rail" />
            <div className="dash-card-overlay">
              <div className="dash-card-title">The Gilded Rail</div>
              <div className="dash-card-desc" style={{ fontSize: 11 }}>SURE · REFINED</div>
            </div>
          </div>
          <div className="dash-card dash-card-small">
            <img src="/images/petal_yeast.png" alt="Petal & Yeast" />
            <div className="dash-card-overlay">
              <div className="dash-card-title">Petal &amp; Yeast</div>
              <div className="dash-card-desc" style={{ fontSize: 11 }}>SURE · VIBRANT</div>
            </div>
          </div>
          <div className="dash-card dash-card-small">
            <img src="/images/summit_lounge.png" alt="Summit Lounge" />
            <div className="dash-card-overlay">
              <div className="dash-card-title">Summit Lounge</div>
              <div className="dash-card-desc" style={{ fontSize: 11 }}>SURE · FOCUSED</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="dash-how" id="how">
        {/* Left — Visual */}
        <div className="dash-how-visual">
          <div className="dash-how-tabs">
            <div
              className={`dash-how-tab ${activeTab === 'geo' ? 'active' : ''}`}
              onClick={() => setActiveTab('geo')}
            >
              <span className="dash-how-tab-dot" />
              Geographic Center
            </div>
            <div
              className={`dash-how-tab ${activeTab === 'time' ? 'active' : ''}`}
              onClick={() => setActiveTab('time')}
            >
              <span className="dash-how-tab-dot" />
              Time-Balanced
            </div>
          </div>

          <div className="dash-how-diagrams">
            {/* Diagram 1 */}
            <div className="dash-diagram-card">
              <div className="dash-diagram-visual">
                <div className="dash-diagram-marker a">A</div>
                <div className="dash-diagram-center red" />
                <div className="dash-diagram-marker b">B</div>
              </div>
              <div className="dash-diagram-label error">Unfair travel time</div>
              <div className="dash-diagram-sub">Calculation ignores traffic, terrain, and transit options.</div>
            </div>
            {/* Diagram 2 */}
            <div className="dash-diagram-card">
              <div className="dash-diagram-visual">
                <div className="dash-diagram-marker a" style={{ background: '#2563eb' }}>●</div>
                <div className="dash-diagram-center blue" style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={16} color="#fff" />
                </div>
                <div className="dash-diagram-marker b" style={{ background: '#ef4444' }}>●</div>
              </div>
              <div className="dash-diagram-label success">Perfectly 15 mins</div>
              <div className="dash-diagram-sub">Syncs travel vectors for a 50/50 fair rendezvous.</div>
            </div>
          </div>
        </div>

        {/* Right — Content */}
        <div className="dash-how-content">
          <h2>The math of meeting,<br/><span>simplified.</span></h2>
          {features.map((f, i) => (
            <div className="dash-feature" key={i}>
              <div className="dash-feature-icon">
                <f.icon size={20} />
              </div>
              <div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      {/* <section className="dash-cta">
        <h2>Ready to find your center?</h2>
        <p>Join 50,000+ luminous cartographers who have found their perfect meeting point today.</p>
        <div className="dash-cta-buttons">
          <button className="dash-cta-primary" onClick={() => navigate('/')}>Get Started for Free</button>
          <button className="dash-cta-secondary">Talk to Sales</button>
        </div>
      </section> */}

      {/* ─── Footer ─── */}
      <footer className="dash-footer">
        <div className="dash-footer-left">
          <div className="dash-footer-logo">Midway</div>
          <div className="dash-footer-copy">&copy; 2024 Midway Place Finder</div>
        </div>
        <div className="dash-footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#support">Contact Support</a>
          {/* <a href="#api">API Documentation</a> */}
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
