import React from 'react';

const TimeDifferenceSlider = ({ value, onChange, min = 0, max = 30 }) => {
  // Calculate gradient for slider track
  const percentage = ((value - min) / (max - min)) * 100;
  const sliderBackground = `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`;

  return (
    <div style={{ marginTop: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
          ⏱️ Time Margin
        </label>
        <div style={{ 
          fontSize: '13px', 
          fontWeight: 700, 
          color: '#4F46E5',
          background: 'rgba(79, 70, 229, 0.1)',
          padding: '2px 8px',
          borderRadius: '6px'
        }}>
          {value} min
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
          <span>{min}m</span>
          <span>{max}m</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 flex items-start gap-2">
        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" width="16" height="16">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
        </svg>
        <span>Maximum acceptable travel time difference between both people is {value} minutes</span>
      </p>
    </div>
  );
};

export default TimeDifferenceSlider;
