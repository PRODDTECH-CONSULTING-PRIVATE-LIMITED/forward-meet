import React from 'react';

const PlaceTypeSelector = ({ placeType, setPlaceType }) => {
  const places = [
    { value: 'lodging', icon: '🏨', label: 'Hotel', width: '91px' },
    { value: 'shopping_mall', icon: '🛍️', label: 'Shopping Mall', width: '149px' },
    { value: 'bar', icon: '🍺', label: 'Pub-Bar', width: '91px' },
    { value: 'restaurant', icon: '🍽️', label: 'Restaurant', width: '91px' },
    { value: 'cafe', icon: '☕', label: 'Coffee Shop', width: '120px' },
    { value: 'night_club', icon: '🎵', label: 'Night Club', width: '110px' },
    { value: 'co_working_space', icon: '💼', label: 'Co-working Space', width: '165px' },
  ];

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .horizontal-scroll-container {
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>

      <div className="w-full">
        {/* Label - Exact Figma Specs */}
        <div
          style={{ 
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: '20px',
            lineHeight: '30px',
            letterSpacing: '0%',
            color: '#474747',
            width: '197px',
            height: '30px',
            marginBottom: '12px'
          }}
        >
          What type of place ?
        </div>
        
        {/* Horizontal Scrollable Container - Exact 438x74px */}
        <div 
          className="horizontal-scroll-container scrollbar-hide"
          style={{ 
            width: '438px',
            height: '74px',
            opacity: 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div 
            style={{ 
              display: 'flex',
              gap: '8px',
              minWidth: 'max-content',
              height: '100%',
              alignItems: 'center'
            }}
          >
            {places.map((place) => (
              <button
                key={place.value}
                onClick={() => setPlaceType(place.value)}
                style={{
                  width: place.width,
                  height: '32px',
                  paddingTop: '4px',
                  paddingRight: '12px',
                  paddingBottom: '4px',
                  paddingLeft: '12px',
                  gap: '8px',
                  borderRadius: '4px',
                  border: placeType === place.value ? 'none' : '0.6px solid #C6C6C6',
                  backgroundColor: placeType === place.value ? '#7C3AED' : '#FFFFFF',
                  opacity: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                  fontSize: '12px',
                  color: placeType === place.value ? '#FFFFFF' : '#474747',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ fontSize: '16px' }}>{place.icon}</span>
                <span>{place.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceTypeSelector;