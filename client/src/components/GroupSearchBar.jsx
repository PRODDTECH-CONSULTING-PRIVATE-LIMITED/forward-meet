import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation, MapPin, CalendarDays, ChevronDown, Plus, Trash2 } from 'lucide-react';

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

export default function GroupSearchBar({ travelMode, placeType, scheduleDate, formatSchedule, setShowCalendar }) {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([{ id: 1, query: '', value: '' }, { id: 2, query: '', value: '' }, { id: 3, query: '', value: '' }]);
  const [options, setOptions] = useState({});
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [highlightedIndices, setHighlightedIndices] = useState({});
  
  const debounceRef = useRef({});

  const fetchSuggestions = useCallback(async (input, index) => {
    if (!input || input.length < 2) { 
      setOptions(prev => ({ ...prev, [index]: [] })); 
      return; 
    }
    try {
      const res = await fetch(
        `http://localhost:8080/api/autocomplete?input=${encodeURIComponent(input)}`
      );
      if (res.ok) {
        const json = await res.json();
        setOptions(prev => ({ ...prev, [index]: json.predictions || [] }));
      }
    } catch (e) {
      console.error('Autocomplete error:', e);
    }
  }, []);

  const onSearch = (val, index) => {
    const newLocations = [...locations];
    newLocations[index].query = val;
    setLocations(newLocations);
    
    if (debounceRef.current[index]) clearTimeout(debounceRef.current[index]);
    debounceRef.current[index] = setTimeout(() => fetchSuggestions(val, index), 300);
  };

  const onSelect = (s, index) => {
    const newLocations = [...locations];
    newLocations[index].value = s.description;
    newLocations[index].query = s.description;
    setLocations(newLocations);
    setOptions(prev => ({ ...prev, [index]: [] }));
    setFocusedIndex(null);
  };

  const handleKeyDown = (e, index) => {
    const opts = options[index] || [];
    const hi = highlightedIndices[index] || -1;

    if (!opts.length) {
      if (e.key === 'Enter') handleFindMidway();
      return;
    }
    if (e.key === 'ArrowDown') { 
      e.preventDefault(); 
      setHighlightedIndices(prev => ({ ...prev, [index]: hi < opts.length - 1 ? hi + 1 : 0 })); 
    } else if (e.key === 'ArrowUp') { 
      e.preventDefault(); 
      setHighlightedIndices(prev => ({ ...prev, [index]: hi > 0 ? hi - 1 : opts.length - 1 })); 
    } else if (e.key === 'Enter' && hi >= 0) { 
      e.preventDefault(); 
      onSelect(opts[hi], index); 
    } else if (e.key === 'Escape') {
      setFocusedIndex(null);
    }
  };

  const addPerson = () => {
    if (locations.length < 10) {
      setLocations([...locations, { id: Date.now(), query: '', value: '' }]);
    }
  };

  const removePerson = (index) => {
    if (locations.length > 2) {
      const newLocations = [...locations];
      newLocations.splice(index, 1);
      setLocations(newLocations);
    }
  };

  const handleFindMidway = () => {
    const validLocations = locations.map(l => l.value.trim()).filter(Boolean);
    if (validLocations.length < 2) {
      alert("Please enter at least 2 valid locations.");
      return;
    }

    const year = scheduleDate.getFullYear();
    const month = String(scheduleDate.getMonth() + 1).padStart(2, '0');
    const day = String(scheduleDate.getDate()).padStart(2, '0');
    const outDate = `${year}-${month}-${day}`;

    // We can't access schedHour directly since it's in Dashboard, but we can just use defaults for now, or pass them down
    // Since we didn't pass time state, we'll just omit it and let AppGroup handle defaults or pass it down.
    
    // Convert array of locations to a JSON string or comma-separated to pass in URL, or just pass it in state
    const params = new URLSearchParams({
      travelMode: travelMode,
      placeType: placeType,
      date: outDate,
      locations: JSON.stringify(validLocations)
    });
    
    navigate(`/venues?${params.toString()}`);
  };

  return (
    <div className="dash-search" style={{ flexDirection: 'column', padding: '20px', gap: '15px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
        {locations.map((loc, index) => (
          <div key={loc.id} className="dash-search-field" style={{ position: 'relative', width: '100%', flex: 'none', borderRight: 'none', padding: '10px 15px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            {index === 0 ? <Navigation className="field-icon" size={18} /> : <MapPin className="field-icon" size={18} />}
            <div className="field-input" style={{ flex: 1 }}>
              <span className="field-label">Person {index + 1}</span>
              <input
                className="field-input-text"
                type="text"
                placeholder="Address, City or Zip"
                value={loc.query}
                onChange={(e) => onSearch(e.target.value, index)}
                onFocus={() => { setFocusedIndex(index); if (loc.query === loc.value) fetchSuggestions(loc.query, index); }}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onBlur={() => setTimeout(() => setFocusedIndex(null), 200)}
                style={{ width: '100%' }}
              />
            </div>
            {locations.length > 2 && (
              <button onClick={() => removePerson(index)} style={{ padding: '8px', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <Trash2 size={16} />
              </button>
            )}
            {focusedIndex === index && options[index] && (
              <Dropdown
                options={options[index]}
                onSelect={(s) => onSelect(s, index)}
                highlightedIndex={highlightedIndices[index] || -1}
                setHighlightedIndex={(hi) => setHighlightedIndices(prev => ({ ...prev, [index]: hi }))}
              />
            )}
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <button 
          onClick={addPerson}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#f1f5f9', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 500, color: '#334155' }}
        >
          <Plus size={16} /> Add Person
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Find Midway Button */}
          <button 
            className="dash-search-btn" 
            onClick={handleFindMidway}
            style={{ margin: 0 }}
          >
            Find Midway
          </button>
        </div>
      </div>
    </div>
  );
}
