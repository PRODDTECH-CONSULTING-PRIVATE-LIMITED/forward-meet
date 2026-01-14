import React from 'react';

const VenueTypeSelector = ({ selected, onSelect }) => {
  const venueTypes = [
    { id: 'restaurant', icon: '🍽️', label: 'Restaurant' },
    { id: 'cafe', icon: '☕', label: 'Cafe' },
    { id: 'bar', icon: '🍺', label: 'Bar' },
    { id: 'park', icon: '🌳', label: 'Park' },
    { id: 'gym', icon: '💪', label: 'Gym' },
  ];

  return (
    <div className="space-y-4 mt-4">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-4 ml-0.5">
        Venue Type
      </label>
      <div className="venue-type-grid mb-6">
        {venueTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`venue-type-button ${selected === type.id ? 'active' : ''}`}
            type="button"
          >
            <span className="venue-type-icon">{type.icon}</span>
            <span className="venue-type-label">{type.label}</span>
          </button>
        ))}
      </div>
      {/* {selected && (
        <p className="text-xs text-slate-500">
          Selected: {venueTypes.find(t => t.id === selected)?.label}
        </p>
      )} */}
    </div>
  );
};

export default VenueTypeSelector;
