import React from 'react';

const SegmentedControl = ({ options, selected, onChange }) => {
  return (
    <div className="flex items-center gap-4">
      <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
        ⚡ Optimize for
      </label>
      <div className="segmented-control" style={{ margin: 0, flex: 1 }}>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`segmented-control-option ${
              selected === option.value ? 'active' : ''
            }`}
            type="button"
            style={{ padding: '6px 12px', fontSize: '13px' }}
          >
            <span className="mr-1.5">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SegmentedControl;
