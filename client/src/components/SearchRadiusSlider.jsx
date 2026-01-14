import React from 'react';

const SearchRadiusSlider = ({ value, onChange, min = 1, max = 50 }) => {
  // Calculate gradient for slider track
  const percentage = ((value - min) / (max - min)) * 100;
  const sliderBackground = `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`;

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        📍 Search Radius
      </label>
      <div className="radius-slider-container">
        <div className="radius-value-display">
          <span className="radius-value-number">{value}</span>
          <span className="radius-value-unit">km</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="radius-slider"
          style={{ background: sliderBackground }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.75rem', color: '#64748b', marginTop: '8px' }}>
          <span>{min}km</span>
          <span>{Math.floor((max - min) / 2)}km</span>
          <span>{max}km</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 flex items-start gap-2">
        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" width="16" height="16">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
        <span>Searching within {value} km of the calculated midpoint</span>
      </p>
    </div>
  );
};

export default SearchRadiusSlider;
