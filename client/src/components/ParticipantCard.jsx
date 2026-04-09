import React from 'react';

const ParticipantCard = ({ 
  label, 
  avatarClass,
  children
}) => {
  const isPersonA = label.toLowerCase().includes('person a') || label.toLowerCase().includes('pickup') || avatarClass === 'person-a';

  return (
    <div className="w-full bg-[#f3f4f6] hover:bg-[#e5e7eb] transition-colors rounded-xl flex items-center px-4 py-2">
      <div className="flex-shrink-0 flex items-center justify-center w-6">
        {isPersonA ? (
          <div className="w-2 h-2 rounded-full bg-black"></div>
        ) : (
          <div className="w-2 h-2 bg-black"></div>
        )}
      </div>

      <div className="flex-1 ml-3 pr-2">
        {children}
      </div>
    </div>
  );
};

export default ParticipantCard;
