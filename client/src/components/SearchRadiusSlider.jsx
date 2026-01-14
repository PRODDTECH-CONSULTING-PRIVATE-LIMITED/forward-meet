import React from 'react';

const SearchRadiusSlider = ({ value, onChange, min = 1, max = 50 }) => {
  // Calculate gradient for slider track
  const percentage = ((value - min) / (max - min)) * 100;
  const sliderBackground = `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`;

  return (
    <div style={{ marginTop: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
          📍 Search Radius
        </label>
        <div style={{ 
          fontSize: '13px', 
          fontWeight: 700, 
          color: '#4F46E5',
          background: 'rgba(79, 70, 229, 0.1)',
          padding: '2px 8px',
          borderRadius: '6px'
        }}>
          {value} km
        </div>
      </div>
      
      <div className="radius-slider-container">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="radius-slider"
          style={{ background: sliderBackground, height: '4px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '10px', color: '#94a3b8', marginTop: '6px', fontWeight: 600 }}>
          <span>{min}km</span>
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
