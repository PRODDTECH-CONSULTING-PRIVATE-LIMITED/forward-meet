import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin } from 'lucide-react';

/* ── icons (stable references) ── */
const NavArrow = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="black" style={{ display: 'block' }}>
    <path d="M2 21L12.05 12.05L21 2L17 12.95L12.05 12.05L2 21Z" />
  </svg>
);

const CrossSvg = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── suggestion row (defined OUTSIDE to avoid remount) ── */
const SuggestionItem = ({ s, onSelect, isHighlighted, onHover }) => {
  const main = s.structured_formatting?.main_text || s.description.split(',')[0];
  const secondary = s.structured_formatting?.secondary_text || s.description.split(',').slice(1).join(',').trim();
  return (
    <li
      className="flex items-center transition-colors"
      style={{ gap: 16, padding: '12px 20px', cursor: 'pointer', backgroundColor: isHighlighted ? '#f3f3f3' : 'transparent' }}
      onMouseDown={(e) => { e.preventDefault(); onSelect(s); }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f3f3'; onHover(); }}
      onMouseLeave={(e) => { if (!isHighlighted) e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full"
        style={{ width: 40, height: 40, backgroundColor: '#e8e8e8' }}
      >
        <MapPin size={18} color="#000" />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="truncate" style={{ fontSize: 15, fontWeight: 700, color: '#000', lineHeight: 1.3 }}>{main}</span>
        {secondary && (
          <span className="truncate" style={{ fontSize: 13, fontWeight: 400, color: '#6b6b6b', lineHeight: 1.3 }}>{secondary}</span>
        )}
      </div>
    </li>
  );
};

/* ── dropdown (defined OUTSIDE to avoid remount) ── */
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

/* ── input row (defined OUTSIDE to avoid remount on parent re-render) ── */
const InputRow = ({
  isPickup,
  value,
  query,
  focused,
  onSearch,
  onSelect,
  onClear,
  onClickSelected,
  options,
  setFocused,
  inputRef,
  wrapRef,
}) => {
  const hasValue = Boolean(value);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);

  // Reset highlighted index when options change
  React.useEffect(() => { setHighlightedIndex(-1); }, [options]);

  const handleKeyDown = (e) => {
    if (!options.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      onSelect(options[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setFocused(false);
    }
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {/* card */}
      <div
        onClick={() => {
          if (hasValue && !focused) {
            onClickSelected(value);
            setFocused(true);
            setTimeout(() => inputRef?.current?.focus(), 50);
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 56,
          paddingLeft: 16,
          paddingRight: 12,
          borderRadius: 12,
          backgroundColor: '#eeeeee',
          border: focused ? '2px solid #000' : '2px solid transparent',
          cursor: hasValue && !focused ? 'pointer' : 'default',
          transition: 'border-color 0.15s',
        }}
      >
        {/* left icon */}
        {/* <div style={{ flexShrink: 0, width: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
          {isPickup ? (
            <div style={{
              width: 8, height: 8,
              borderRadius: '50%',
              backgroundColor: '#000',
              boxShadow: '0 0 0 3px #eeeeee, 0 0 0 4.5px #000',
            }} />
          ) : (
            <div style={{ width: 8, height: 8, backgroundColor: '#000' }} />
          )}
        </div> */}

        {/* text area */}
        <div style={{ flex: 1, marginLeft: 12, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 36 }}>
          {hasValue && !focused ? (
            /* selected state */
            <>
              <span style={{ fontSize: 11, color: '#6b6b6b', lineHeight: 1.2 }}>
                {isPickup ? 'Pickup location' : 'Dropoff location'}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#000', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {value}
              </span>
            </>
          ) : (
            /* input state */
            <input
              ref={inputRef}
              type="text"
              value={query}
              placeholder={isPickup ? 'Pickup location' : 'Dropoff location'}
              onChange={(e) => onSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onKeyDown={handleKeyDown}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 16,
                color: '#000',
                padding: 0,
                margin: 0,
                lineHeight: 1.4,
              }}
            />
          )}
        </div>

        {/* right icon */}
        <div style={{ flexShrink: 0, marginLeft: 8, display: 'flex', alignItems: 'center' }}>
          {hasValue ? (
            <button
              type="button"
              onClick={onClear}
              style={{
                width: 28, height: 28,
                borderRadius: '50%',
                backgroundColor: '#d6d6d6',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#000',
                padding: 0,
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#bbb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#d6d6d6'}
            >
              {CrossSvg}
            </button>
          ) :null}
        </div>
      </div>

      {/* suggestions dropdown */}
      {focused && <Dropdown options={options} onSelect={onSelect} highlightedIndex={highlightedIndex} setHighlightedIndex={setHighlightedIndex} />}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════ */

const LocationSelector = ({
  location1,
  location2,
  setLocation1,
  setLocation2,
  location1InputRef,
  location2InputRef,
}) => {
  const [query1, setQuery1] = useState('');
  const [query2, setQuery2] = useState('');
  const [options1, setOptions1] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [focused1, setFocused1] = useState(false);
  const [focused2, setFocused2] = useState(false);

  const debounce1 = useRef(null);
  const debounce2 = useRef(null);
  const wrap1 = useRef(null);
  const wrap2 = useRef(null);

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

  const select1 = useCallback((s) => { setLocation1(s.description); setQuery1(''); setOptions1([]); setFocused1(false); }, [setLocation1]);
  const select2 = useCallback((s) => { setLocation2(s.description); setQuery2(''); setOptions2([]); setFocused2(false); }, [setLocation2]);
  const clear1 = useCallback((e) => { e.stopPropagation(); setLocation1(''); setQuery1(''); setOptions1([]); }, [setLocation1]);
  const clear2 = useCallback((e) => { e.stopPropagation(); setLocation2(''); setQuery2(''); setOptions2([]); }, [setLocation2]);
  const clickSelected1 = useCallback((val) => { setQuery1(val); fetchSuggestions(val, setOptions1); }, [fetchSuggestions]);
  const clickSelected2 = useCallback((val) => { setQuery2(val); fetchSuggestions(val, setOptions2); }, [fetchSuggestions]);

  useEffect(() => {
    const handler = (e) => {
      if (wrap1.current && !wrap1.current.contains(e.target)) setFocused1(false);
      if (wrap2.current && !wrap2.current.contains(e.target)) setFocused2(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {/* vertical connector line */}
      {/* <div
        style={{
          position: 'absolute',
          left: 27,
          top: 36,
          bottom: 36,
          width: 2,
          backgroundColor: '#000',
          zIndex: 1,
        }}
      /> */}

      {/* Pickup */}
      <div style={{ marginBottom: 4 }}>
        <InputRow
          isPickup
          value={location1}
          query={query1}
          focused={focused1}
          onSearch={onSearch1}
          onSelect={select1}
          onClear={clear1}
          onClickSelected={clickSelected1}
          options={options1}
          setFocused={setFocused1}
          inputRef={location1InputRef}
          wrapRef={wrap1}
        />
      </div>

      {/* Dropoff */}
      <InputRow
        isPickup={false}
        value={location2}
        query={query2}
        focused={focused2}
        onSearch={onSearch2}
        onSelect={select2}
        onClear={clear2}
        onClickSelected={clickSelected2}
        options={options2}
        setFocused={setFocused2}
        inputRef={location2InputRef}
        wrapRef={wrap2}
      />
    </div>
  );
};

export default LocationSelector;