import React from 'react';

const SearchRadiusSlider = ({ value, onChange, min = 1, max = 10 }) => {
  // Calculate gradient for slider track
  const percentage = ((value - min) / (max - min)) * 100;
  const sliderBackground = `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`;

  return (
    <div style={{ marginTop: '0', display: 'flex', alignItems: 'center', gap: '12px', height: '32px', position: 'relative' }}>
      <span style={{ 
        fontSize: '10px', 
        fontWeight: 700, 
        color: '#1a1a1a', 
        textTransform: 'uppercase', 
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
        minWidth: '95px',
        display: 'flex',
        alignItems: 'center'
      }}>
        Search Radius
      </span>
      
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', height: '100%' }}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="radius-slider"
          style={{ background: sliderBackground, height: '3px', margin: 0, width: '100%', display: 'block' }}
        />
        <div style={{ 
          position: 'absolute', 
          top: '24px', 
          left: 0, 
          right: 0, 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '9px', 
          color: '#94a3b8', 
          fontWeight: 600,
          pointerEvents: 'none',
          lineHeight: '1'
        }}>
          <span>{min}km</span>
          <span>{max}km</span>
        </div>
      </div>

      <div style={{ 
        fontSize: '10px', 
        fontWeight: 700, 
        color: '#6366f1',
        background: '#EEF2FF',
        padding: '2px 8px',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
        minWidth: '45px',
        textAlign: 'center',
        flexShrink: 0
      }}>
        {value} km
      </div>
    </div>
  );
};

export default SearchRadiusSlider;
