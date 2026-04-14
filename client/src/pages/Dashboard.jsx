import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car, Train, Coffee, UtensilsCrossed, Building2, Footprints, Bike, Beer, TreePine, Dumbbell,
  ArrowRightLeft, CalendarDays, ChevronDown, ArrowRight,
  Clock, SlidersHorizontal, Calendar, Navigation, MapPin
} from 'lucide-react';
import './dashboard.css';

/* ── dropdown components borrowed from location-selector ── */
const SuggestionItem = ({ s, onSelect, isHighlighted, onHover }) => {
  const main = s.structured_formatting?.main_text || s.description.split(',')[0];
  const secondary = s.structured_formatting?.secondary_text || s.description.split(',').slice(1).join(',').trim();
  return (
    <li
      className="flex items-center transition-colors dash-suggestion-item"
      style={{ padding: '12px 20px', cursor: 'pointer', backgroundColor: isHighlighted ? '#f3f3f3' : 'transparent', display: 'flex', gap: '16px' }}
      onMouseDown={(e) => { e.preventDefault(); onSelect(s); }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f3f3'; onHover(); }}
      onMouseLeave={(e) => { if (!isHighlighted) e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full"
        style={{ width: 40, height: 40, backgroundColor: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: '9999px' }}
      >
        <MapPin size={18} color="#000" />
      </div>
      <div className="flex flex-col flex-1 min-w-0" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, textAlign: 'left' }}>
        <span className="truncate" style={{ fontSize: 15, fontWeight: 700, color: '#000', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{main}</span>
        {secondary && (
          <span className="truncate" style={{ fontSize: 13, fontWeight: 400, color: '#6b6b6b', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{secondary}</span>
        )}
      </div>
    </li>
  );
};

const Dropdown = ({ options, onSelect, highlightedIndex, setHighlightedIndex }) =>
  options.length > 0 ? (
    <div
      style={{
        position: 'absolute',
        left: 0, right: 0, top: '100%',
        marginTop: 4,
        backgroundColor: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
        zIndex: 50,
        maxHeight: 340,
        overflowY: 'auto',
      }}
    >
      <ul style={{ padding: '4px 0', margin: 0, listStyle: 'none' }}>
        {options.map((s, i) => (
          <SuggestionItem
            key={i}
            s={s}
            onSelect={onSelect}
            isHighlighted={i === highlightedIndex}
            onHover={() => setHighlightedIndex(i)}
          />
        ))}
      </ul>
    </div>
  ) : null;

/* ── Custom Calendar Popup ── */
const CalendarPopup = ({ date, setDate, timeHour, setTimeHour, timeMin, setTimeMin, amPm, setAmPm, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(date);
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: prevMonthDays - firstDay + i + 1, isPrev: true });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrent: true, isSelected: i === date.getDate() && month === date.getMonth() && year === date.getFullYear() });
  }
  
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, isNext: true });
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  return (
    <div className="dash-cal-popup" onClick={e => e.stopPropagation()}>
      <div className="dash-cal-header">
        <div className="dash-cal-title">{monthNames[month]} {year}</div>
        <div className="dash-cal-nav">
           <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>{'<'}</button>
           <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>{'>'}</button>
        </div>
      </div>
      
      <div className="dash-cal-weekdays">
         {['S','M','T','W','T','F','S'].map((d,i) => <span key={i}>{d}</span>)}
      </div>
      
      <div className="dash-cal-grid">
         {days.map((d, i) => (
           <button 
             key={i} 
             className={`dash-cal-day ${d.isPrev||d.isNext ? 'faded' : ''} ${d.isSelected ? 'selected' : ''}`}
             onClick={() => { if(d.isCurrent) setDate(new Date(year, month, d.day)) }}
           >
             {d.day}
           </button>
         ))}
      </div>
      
      <div className="dash-cal-footer">
        <div className="dash-cal-time-wrap">
          <span className="dash-cal-time-label">TIME</span>
          <input className="dash-cal-time-input" value={timeHour} onChange={e => setTimeHour(e.target.value)} />
          <span style={{margin:'0 2px', fontWeight: 700}}>:</span>
          <input className="dash-cal-time-input" value={timeMin} onChange={e => setTimeMin(e.target.value)} />
          
          <div className="dash-cal-ampm">
            <button className={amPm==='AM'?'active':''} onClick={()=>setAmPm('AM')}>AM</button>
            <button className={amPm==='PM'?'active':''} onClick={()=>setAmPm('PM')}>PM</button>
          </div>
        </div>
        
        <div className="dash-cal-actions">
           
           <button className="dash-cal-set" onClick={onClose}>SET</button>
        </div>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [travelMode, setTravelMode] = useState('driving');
  const [placeType, setPlaceType] = useState('restaurant');
  const [activeTab, setActiveTab] = useState('time');
  const [activeNav, setActiveNav] = useState('meeting');
  const [loc1, setLoc1] = useState('');
  const [loc2, setLoc2] = useState('');

  /* ── autocomplete state & logic ── */
  const [query1, setQuery1] = useState('');
  const [query2, setQuery2] = useState('');
  const [options1, setOptions1] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [focused1, setFocused1] = useState(false);
  const [focused2, setFocused2] = useState(false);
  const [highlightedIndex1, setHighlightedIndex1] = useState(-1);
  const [highlightedIndex2, setHighlightedIndex2] = useState(-1);

  const debounce1 = useRef(null);
  const debounce2 = useRef(null);
  const wrap1 = useRef(null);
  const wrap2 = useRef(null);
  const wrapSchedule = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);

  /* ── Calendar state ── */
  const [showCalendar, setShowCalendar] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(() => new Date());
  
  const [schedHour, setSchedHour] = useState(() => {
    let d = new Date(); d.setHours(d.getHours() + 1); 
    const h = d.getHours() % 12 || 12; 
    return String(h).padStart(2, '0');
  });
  
  const [schedMin, setSchedMin] = useState("00");
  
  const [schedAmPm, setSchedAmPm] = useState(() => {
    let d = new Date(); d.setHours(d.getHours() + 1); 
    return d.getHours() >= 12 ? 'PM' : 'AM';
  });

  const formatSchedule = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const m = monthNames[scheduleDate.getMonth()];
    const d = scheduleDate.getDate();
    const y = scheduleDate.getFullYear();
    return `${m} ${d}, ${y} • ${schedHour}:${schedMin} ${schedAmPm}`;
  }

  const fetchSuggestions = useCallback(async (input, setOptions) => {
    if (!input || input.length < 2) { setOptions([]); return; }
    try {
      const res = await fetch(
        `http://localhost:8080/api/autocomplete?input=${encodeURIComponent(input)}`
      );
      if (res.ok) {
        const json = await res.json();
        setOptions(json.predictions || []);
      }
    } catch (e) {
      console.error('Autocomplete error:', e);
    }
  }, []);

  const onSearch1 = useCallback((val) => {
    setQuery1(val);
    clearTimeout(debounce1.current);
    debounce1.current = setTimeout(() => fetchSuggestions(val, setOptions1), 300);
  }, [fetchSuggestions]);

  const onSearch2 = useCallback((val) => {
    setQuery2(val);
    clearTimeout(debounce2.current);
    debounce2.current = setTimeout(() => fetchSuggestions(val, setOptions2), 300);
  }, [fetchSuggestions]);

  const select1 = useCallback((s) => { 
    setLoc1(s.description); 
    setQuery1(s.description); 
    setOptions1([]); 
    setFocused1(false); 
    input1Ref.current?.blur();
  }, []);
  
  const select2 = useCallback((s) => { 
    setLoc2(s.description); 
    setQuery2(s.description); 
    setOptions2([]); 
    setFocused2(false); 
    input2Ref.current?.blur();
  }, []);

  useEffect(() => { setHighlightedIndex1(-1); }, [options1]);
  useEffect(() => { setHighlightedIndex2(-1); }, [options2]);

  const handleKeyDown1 = (e) => {
    if (!options1.length) {
      if (e.key === 'Enter') handleFindMidway();
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightedIndex1((prev) => (prev < options1.length - 1 ? prev + 1 : 0)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightedIndex1((prev) => (prev > 0 ? prev - 1 : options1.length - 1)); }
    else if (e.key === 'Enter' && highlightedIndex1 >= 0) { e.preventDefault(); select1(options1[highlightedIndex1]); }
    else if (e.key === 'Escape') setFocused1(false);
  };

  const handleKeyDown2 = (e) => {
    if (!options2.length) {
      if (e.key === 'Enter') handleFindMidway();
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightedIndex2((prev) => (prev < options2.length - 1 ? prev + 1 : 0)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightedIndex2((prev) => (prev > 0 ? prev - 1 : options2.length - 1)); }
    else if (e.key === 'Enter' && highlightedIndex2 >= 0) { e.preventDefault(); select2(options2[highlightedIndex2]); }
    else if (e.key === 'Escape') setFocused2(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (wrap1.current && !wrap1.current.contains(e.target)) setFocused1(false);
      if (wrap2.current && !wrap2.current.contains(e.target)) setFocused2(false);
      if (wrapSchedule.current && !wrapSchedule.current.contains(e.target)) setShowCalendar(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);


  const handleFindMidway = () => {
    if (!loc1.trim() || !loc2.trim()) return;

    const year = scheduleDate.getFullYear();
    const month = String(scheduleDate.getMonth() + 1).padStart(2, '0');
    const day = String(scheduleDate.getDate()).padStart(2, '0');
    const outDate = `${year}-${month}-${day}`;

    let h = parseInt(schedHour, 10) || 0;
    if (schedAmPm === 'PM' && h < 12) h += 12;
    if (schedAmPm === 'AM' && h === 12) h = 0;
    const outTime = `${String(h).padStart(2, '0')}:${String(schedMin).padStart(2, '0')}`;

    const params = new URLSearchParams({
      loc1: loc1.trim(),
      loc2: loc2.trim(),
      travelMode: travelMode,
      placeType: placeType,
      date: outDate,
      time: outTime
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
        <div className="dash-nav-left">
          <a href="#how" className="dash-nav-link">How it Works</a>
        </div>
        <div className="dash-nav-center">
          <div className="dash-logo">Midway</div>
        </div>
        <div className="dash-nav-right">
          <a 
            href="#meeting" 
            className={`dash-nav-link ${activeNav === 'meeting' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveNav('meeting'); }}
          >
            We are meeting
          </a>
          <a 
            href="#group" 
            className={`dash-nav-link ${activeNav === 'group' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveNav('group'); }}
          >
            Group Meet
          </a>
          <a 
            href="#travelling" 
            className={`dash-nav-link ${activeNav === 'travelling' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setActiveNav('travelling'); }}
          >
            I am travelling
          </a>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="dash-hero">
        <h1>Find your perfect <span>midpoint</span>.</h1>
        <p>Calculate the fairest and most convenient meeting location for everyone, based on real-time traffic and transit logistics.</p>

        {/* Search Bar */}
        <div className="dash-search">
          {/* Start Point A */}
          <div className="dash-search-field" ref={wrap1} style={{ position: 'relative' }}>
            <Navigation className="field-icon" size={18} />
            <div className="field-input">
              <span className="field-label">Your Location</span>
              <input
                ref={input1Ref}
                className="field-input-text"
                type="text"
                placeholder="Address, City or Zip"
                value={query1}
                onChange={(e) => onSearch1(e.target.value)}
                onFocus={() => { setFocused1(true); if (query1 === loc1) fetchSuggestions(query1, setOptions1); }}
                onKeyDown={handleKeyDown1}
              />
            </div>
            {focused1 && (
              <Dropdown
                options={options1}
                onSelect={select1}
                highlightedIndex={highlightedIndex1}
                setHighlightedIndex={setHighlightedIndex1}
              />
            )}
          </div>

          {/* Swap Button */}
          <button 
            className="dash-search-swap" 
            title="Swap locations"
            onClick={() => {
              const tempQuery = query1; const tempLoc = loc1;
              setQuery1(query2); setLoc1(loc2);
              setQuery2(tempQuery); setLoc2(tempLoc);
            }}
          >
            <span className="swap-icon">⇄</span>
          </button>

          {/* Start Point B */}
          <div className="dash-search-field" ref={wrap2} style={{ position: 'relative' }}>
            <MapPin className="field-icon" size={18} />
            <div className="field-input">
              <span className="field-label">Friend's Location</span>
              <input
                ref={input2Ref}
                className="field-input-text"
                type="text"
                placeholder="Address, City or Zip"
                value={query2}
                onChange={(e) => onSearch2(e.target.value)}
                onFocus={() => { setFocused2(true); if (query2 === loc2) fetchSuggestions(query2, setOptions2); }}
                onKeyDown={handleKeyDown2}
              />
            </div>
            {focused2 && (
              <Dropdown
                options={options2}
                onSelect={select2}
                highlightedIndex={highlightedIndex2}
                setHighlightedIndex={setHighlightedIndex2}
              />
            )}
          </div>

          <div className="dash-search-divider" />

          {/* Schedule */}
          <div className="dash-search-schedule" ref={wrapSchedule} style={{ position: 'relative' }}>
            <CalendarDays className="field-icon" size={18} />
            <div className="field-input" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setShowCalendar(prev => !prev)}>
              <span className="field-label">Meeting Time</span>
              <div className="field-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 6, width: '100%' }}>
                <span style={{ color: '#1e293b', fontWeight: 500 }}>{formatSchedule()}</span>
                <ChevronDown size={14} style={{ color: '#aaa', marginLeft: 'auto' }} />
              </div>
            </div>
            {showCalendar && (
              <CalendarPopup 
                date={scheduleDate} setDate={setScheduleDate}
                timeHour={schedHour} setTimeHour={setSchedHour}
                timeMin={schedMin} setTimeMin={setSchedMin}
                amPm={schedAmPm} setAmPm={setSchedAmPm}
                onClose={() => setShowCalendar(false)}
              />
            )}
          </div>

          {/* Find Midway Button */}
          <button 
            className="dash-search-btn" 
            onClick={handleFindMidway}
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
          {[
            { id: 'driving', label: 'Driving', Icon: Car },
            { id: 'transit', label: 'Transit', Icon: Train },
            { id: 'walking', label: 'Walk', Icon: Footprints },
            { id: 'bicycling', label: 'Bike', Icon: Bike },
          ].map(({ id, label, Icon }) => (
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
          {[
            { id: 'restaurant', label: 'Restaurant', Icon: UtensilsCrossed },
            { id: 'cafe', label: 'Cafe', Icon: Coffee },
            { id: 'bar', label: 'Bar', Icon: Beer },
            { id: 'park', label: 'Park', Icon: TreePine },
            { id: 'gym', label: 'Gym', Icon: Dumbbell },
          ].map(({ id, label, Icon }) => (
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
          <a href="/editors-recommendation">View all locations <ArrowRight size={16} /></a>
        </div>
        <div className="dash-picks-underline" />
        <p className="dash-picks-sub">Curated outdoor restaurants for high-efficiency collaboration.</p>

        {/* Top Row — 2 large cards */}
        <div className="dash-cards-top">
          <div className="dash-card dash-card-large" onClick={() => navigate('/editors-recommendation#lupa-bengaluru')}>
            <img src="/images/real/lupa.jpg" alt="Lupa Bengaluru" />
            <div className="dash-card-overlay">
              <div className="dash-card-badge top-rated">Top Rated</div>
              <div className="dash-card-rating">★ 4.9 (120 reviews)</div>
              <div className="dash-card-title">Lupa Bengaluru</div>
              <div className="dash-card-desc">Modern European from risottos to bone marrow. A sprawling space with a welcoming courtyard in Tuscany style.</div>
            </div>
          </div>
          <div className="dash-card dash-card-large" onClick={() => navigate('/editors-recommendation#13th-floor-bar')}>
            <img src="/images/real/13th_floor.jpg" alt="13th Floor Bar" />
            <div className="dash-card-overlay">
              <div className="dash-card-title">13th Floor Bar</div>
              <div className="dash-card-desc">Iconic rooftop bar promising great ambience and the best views of the Bengaluru skyline.</div>
            </div>
          </div>
        </div>

        {/* Bottom Row — 3 small cards */}
        <div className="dash-cards-bottom">
          <div className="dash-card dash-card-small" onClick={() => navigate('/editors-recommendation#suzy-q')}>
            <img src="/images/real/suzy_q.jpg" alt="Suzy Q" />
            <div className="dash-card-overlay">
              <div className="dash-card-title">Suzy Q</div>
              <div className="dash-card-desc" style={{ fontSize: 11 }}>CUNNINGHAM ROAD · GLOBAL FOOD</div>
            </div>
          </div>
          <div className="dash-card dash-card-small" onClick={() => navigate('/editors-recommendation#the-polo-club')}>
            <img src="/images/real/polo_club.jpg" alt="The Polo Club" />
            <div className="dash-card-overlay">
              <div className="dash-card-title">The Polo Club</div>
              <div className="dash-card-desc" style={{ fontSize: 11 }}>THE OBEROI · GARDEN</div>
            </div>
          </div>
          <div className="dash-card dash-card-small" onClick={() => navigate('/editors-recommendation#spice-terrace')}>
            <img src="/images/real/spice_terrace.jpg" alt="Spice Terrace" />
            <div className="dash-card-overlay">
              <div className="dash-card-title">Spice Terrace</div>
              <div className="dash-card-desc" style={{ fontSize: 11 }}>JW MARRIOTT · POOLSIDE</div>
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
