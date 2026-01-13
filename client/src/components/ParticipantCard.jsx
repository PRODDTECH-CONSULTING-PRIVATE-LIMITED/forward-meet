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
      style={{ cursor: 'text' }}
    >
      <div className="flex items-center gap-3">
        <div className={`participant-avatar ${avatarClass}`}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium text-slate-600 block mb-1">
            {label}
          </label>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full border-none outline-none text-sm text-slate-800 bg-transparent"
          />
        </div>
        {value && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            type="button"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ParticipantCard;
