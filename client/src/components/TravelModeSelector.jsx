import React from 'react';

const TravelModeSelector = ({ selected, onSelect }) => {
  const modes = [
    { id: 'driving', icon: '🚗', label: 'Drive' },
    { id: 'transit', icon: '🚇', label: 'Transit' },
    { id: 'walking', icon: '🚶', label: 'Walk' },
    { id: 'bicycling', icon: '🚴', label: 'Bike' },
  ];

  return (
    <div className="space-y-4 mt-4">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
        🚗 How will you travel?
      </label>
      <div className="venue-type-grid grid-cols-4">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className={`venue-type-button ${selected === mode.id ? 'active' : ''}`}
            type="button"
          >
            <span className="venue-type-icon">{mode.icon}</span>
            <span className="venue-type-label">{mode.label}</span>
          </button>
        ))}
      </div>
      {/* {selected && (
        <p className="text-xs text-slate-500">
          Selected: {modes.find(m => m.id === selected)?.label}
        </p>
      )} */}
    </div>
  );
};

export default TravelModeSelector;
