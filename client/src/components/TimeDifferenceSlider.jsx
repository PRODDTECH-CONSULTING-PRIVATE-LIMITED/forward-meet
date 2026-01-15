import React from 'react';

const TimeDifferenceSlider = ({ value, onChange, min = 0, max = 30 }) => {
  // Calculate gradient for slider track
  const percentage = ((value - min) / (max - min)) * 100;
  const sliderBackground = `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`;

  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0, flex: 1, marginRight: '8px' }}>
          <span style={{ 
            fontSize: '10px', 
            fontWeight: 700, 
            color: '#1a1a1a', 
            textTransform: 'uppercase', 
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap'
          }}>
            Time Margin
          </span>
          <span style={{ color: '#E5E7EB', fontWeight: 400, fontSize: '10px' }}>•</span>
          <span style={{ 
            fontSize: '10px', 
            color: '#64748b', 
            fontWeight: 400,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            Max difference in travel time between people
          </span>
        </div>
        <div style={{ 
          fontSize: '10px', 
          fontWeight: 700, 
          color: '#6366f1',
          background: '#EEF2FF',
          padding: '1px 6px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}>
          {value} min
        </div>
      </div>
      
      <div style={{ padding: '0 0 2px' }}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="radius-slider"
          style={{ background: sliderBackground, height: '3px', margin: 0 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '8px', color: '#94a3b8', marginTop: '2px', fontWeight: 600 }}>
          <span>{min}m</span>
          <span>{max}m</span>
        </div>
      </div>
    </div>
  );
};

export default TimeDifferenceSlider;
