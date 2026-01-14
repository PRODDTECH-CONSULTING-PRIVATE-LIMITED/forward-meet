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
      className={`participant-card ${value ? 'filled' : ''} group`}
      onClick={handleCardClick}
      style={{ cursor: 'text', position: 'relative', padding: '18px 20px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className={`participant-avatar ${avatarClass} shadow-md`}>
          <div className="absolute inset-0 bg-white/20 rounded-full scale-75 blur-sm group-hover:blur-none transition-all duration-300"></div>
          <svg style={{ width: '1.25rem', height: '1.25rem', position: 'relative', zIndex: 1 }} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        </div>
        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
          <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-1">
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
              fontSize: '0.925rem',
              fontWeight: 600,
              color: '#0f172a',
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
        style={{ color: '#94a3b8', background: 'transparent', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        type="button"
        onMouseEnter={(e) => e.currentTarget.style.color = '#6366f1'}
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
