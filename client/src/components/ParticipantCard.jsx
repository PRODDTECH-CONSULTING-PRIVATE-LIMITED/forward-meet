import React from 'react';

const ParticipantCard = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  avatarClass,
  onClear,
  inputRef
}) => {
  const handleCardClick = () => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className={`participant-card ${value ? 'filled' : ''}`}
      onClick={handleCardClick}
      style={{ cursor: 'text', position: 'relative' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className={`participant-avatar ${avatarClass}`}>
          <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        </div>
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <label className="text-xs font-medium text-slate-600 block mb-1" style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>
            {label}
          </label>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{ 
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.875rem',
              color: '#1e293b',
              background: 'transparent',
              position: 'relative',
              zIndex: 1,
              padding: 0
            }}
          />
        </div>
        {value && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            style={{ color: '#94a3b8', transition: 'color 0.2s' }}
            type="button"
            onMouseEnter={(e) => e.currentTarget.style.color = '#475569'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            <svg style={{ width: '1rem', height: '1rem' }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ParticipantCard;
