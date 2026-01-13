import React from 'react';

const SegmentedControl = ({ options, selected, onChange }) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        ⚡ Optimize for
      </label>
      <div className="segmented-control">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`segmented-control-option ${
              selected === option.value ? 'active' : ''
            }`}
            type="button"
          >
            <span className="mr-2">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500 flex items-start gap-2">
        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" width="16" height="16">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
        </svg>
        <span>
          {selected === 'time' 
            ? 'Finds venues with equal travel time for everyone'
            : 'Finds venues at equal distance from all participants'
          }
        </span>
      </p>
    </div>
  );
};

export default SegmentedControl;
