import React from 'react';

const SegmentedControl = ({ options, selected, onChange }) => {
  return (
    <div className="flex items-center gap-3" style={{ height: '36px' }}>
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap" style={{ minWidth: '95px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        ⚡ Optimize for
      </label>
      <div className="segmented-control" style={{ margin: 0, flex: 1, padding: '3px', display: 'flex', alignItems: 'center' }}>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`segmented-control-option ${
              selected === option.value ? 'active' : ''
            }`}
            type="button"
            style={{ padding: '4px 10px', fontSize: '12px', flex: 1 }}
          >
            <span className="mr-1.5" style={{ fontSize: '14px' }}>{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SegmentedControl;
