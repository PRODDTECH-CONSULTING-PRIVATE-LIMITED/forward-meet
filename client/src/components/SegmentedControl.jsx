import React from 'react';

const SegmentedControl = ({ options, selected, onChange }) => {
  return (
    <div style={{ width: '100%' }}>
      {/* Section Label */}
      <p style={{
        fontSize: '12px',
        fontWeight: 700,
        color: '#595C5E',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: '10px'
      }}>
        OPTIMIZE FOR
      </p>

      {/* Pill Toggle */}
      <div style={{
        display: 'inline-flex',
        background: '#f1f5f9',
        borderRadius: '999px',
        padding: '4px',
        gap: '2px'
      }}>
        {options.map((option) => {
          const active = selected === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              type="button"
              style={{
                padding: '8px 24px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: active ? 700 : 500,
                color: active ? '#2563eb' : '#64748b',
                background: active ? '#ffffff' : 'transparent',
                boxShadow: active ? '0 1px 4px rgba(0,0,0,0.12)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SegmentedControl;
