import React from 'react'

const SidebarHeader = ({ totalResults, onToggle }) => {
  return (
    <div style={{ padding: '20px 22px 16px 22px', position: 'relative' }}>

      {/* Close button */}
      <button
        onClick={onToggle}
        aria-label="Close sidebar"
        style={{
          position: 'absolute',
          top: '18px',
          right: '18px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '28px',
          color: '#1e293b',
          lineHeight: 1,
          padding: '2px 6px',
          borderRadius: '6px',
          transition: 'background 0.15s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
      >
        ×
      </button>

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', paddingRight: '36px' }}>
        <h2
          style={{
            margin: 0,
            fontSize: '26px',
            fontWeight: 700,
            color: '#2C2F31',
            letterSpacing: '-0.03em',
            lineHeight: 1.15
          }}
        >
          Suggested Venues
        </h2>

        <span
          style={{
            fontSize: '19px',
            fontWeight: 600,
            color: '#64748b'
          }}
        >
          {totalResults}
        </span>
      </div>

      {/* Subtitle */}
      <p
        style={{
          margin: '4px 0 0',
          fontSize: '13.5px',
          color: '#595C5E',
          fontWeight: 400
        }}
      >
        Curated for your route
      </p>
    </div>
  );
};

export default SidebarHeader;
