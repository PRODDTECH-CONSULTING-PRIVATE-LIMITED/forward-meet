import React from 'react';

const TimeDifferenceSlider = ({ value, onChange, min = 0, max = 30 }) => {
  // Calculate gradient for slider track
  const percentage = ((value - min) / (max - min)) * 100;
  const sliderBackground = `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`;

  return (
    <div style={{ marginTop: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">⏱️ Time Margin</span>
          <div style={{ 
            fontSize: '11px', 
            fontWeight: 700, 
            color: '#4F46E5',
            background: 'rgba(79, 70, 229, 0.08)',
            padding: '1px 6px',
            borderRadius: '4px'
          }}>
            {value} min
          </div>
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
      
      <div className="flex items-center gap-1.5 opacity-70">
        <svg 
          style={{ width: '14px', height: '14px' }} 
          className="text-slate-400" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span className="text-[10px] text-slate-500 font-medium">Max difference in travel time between people</span>
      </div>
    </div>
  );
};

export default TimeDifferenceSlider;
