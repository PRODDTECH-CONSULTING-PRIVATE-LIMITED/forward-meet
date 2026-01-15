import React from 'react';

const TimeDifferenceSlider = ({ value, onChange, min = 0, max = 30 }) => {
  // Calculate gradient for slider track
  const percentage = ((value - min) / (max - min)) * 100;
  const sliderBackground = `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`;

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider whitespace-nowrap flex-shrink-0">
            ⏱️ Time Margin
          </span>
          <span className="text-slate-300 flex-shrink-0">•</span>
          <span className="text-[9px] text-slate-500 font-medium whitespace-nowrap truncate">
            Max difference in travel time between people
          </span>
        </div>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: 700, 
          color: '#4F46E5',
          background: 'rgba(79, 70, 229, 0.08)',
          padding: '1px 6px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}>
          {value} min
        </div>
      </div>
      
      <div style={{ padding: '4px 0 8px' }}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="radius-slider"
          style={{ background: sliderBackground, height: '4px', margin: 0 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '9px', color: '#94a3b8', marginTop: '4px', fontWeight: 600 }}>
          <span>{min}m</span>
          <span>{max}m</span>
        </div>
      </div>
    </div>
  );
};

export default TimeDifferenceSlider;
