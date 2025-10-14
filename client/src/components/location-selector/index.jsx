import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const LocationSelector = ({ 
  location1, 
  location2, 
  setLocation1, 
  setLocation2, 
  location1InputRef, 
  location2InputRef,
  onInputsVisible
}) => {
  const [showLocationInputs, setShowLocationInputs] = useState(false);

  const handleSelectLocationClick = () => {
    setShowLocationInputs(true);
  };

  // Call onInputsVisible when inputs become visible
  useEffect(() => {
    if (showLocationInputs && onInputsVisible) {
      // Small delay to ensure DOM elements are rendered
      setTimeout(() => {
        onInputsVisible();
      }, 100);
    }
  }, [showLocationInputs, onInputsVisible]);

  return (
    <div className="mb-4">
      {!showLocationInputs ? (
        // Initial Button - Figma Styled
        <button 
          onClick={handleSelectLocationClick}
          style={{
            width: '100%',
            height: '54px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #C6C6C6',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '20px',
            fontWeight: '500',
            lineHeight: '30px',
            color: '#777777'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#999999';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#C6C6C6';
          }}
        >
          <MapPin size={24} color="#777777" strokeWidth={1.5} fill="none" />
          <span>Select Location</span>
        </button>
      ) : (
        // Location Input Fields
        <div className="space-y-4">
          {/* Starting Location */}
          <div>
            <label 
              className="block font-medium mb-2"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: '#4B5563'
              }}
            >
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Starting Location
              </span>
            </label>
            <input
              type="text"
              ref={location1InputRef}
              placeholder="e.g., Jayanagar, Bengaluru"
              value={location1}
              onChange={(e) => setLocation1(e.target.value)}
              style={{
                width: '100%',
                height: '54px',
                padding: '12px 16px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '16px',
                fontWeight: '400',
                lineHeight: '24px',
                color: '#000000',
                backgroundColor: '#FFFFFF',
                border: '1px solid #C6C6C6',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
              onBlur={(e) => e.target.style.borderColor = '#C6C6C6'}
              autoComplete="off"
              required
            />
          </div>
          
          {/* Destination Location */}
          <div>
            <label 
              className="block font-medium mb-2"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
                color: '#4B5563'
              }}
            >
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Destination Location
              </span>
            </label>
            <input
              type="text"
              ref={location2InputRef}
              placeholder="e.g., Indiranagar, Bengaluru"
              value={location2}
              onChange={(e) => setLocation2(e.target.value)}
              style={{
                width: '100%',
                height: '54px',
                padding: '12px 16px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '16px',
                fontWeight: '400',
                lineHeight: '24px',
                color: '#000000',
                backgroundColor: '#FFFFFF',
                border: '1px solid #C6C6C6',
                borderRadius: '6px',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#A855F7'}
              onBlur={(e) => e.target.style.borderColor = '#C6C6C6'}
              autoComplete="off"
              required
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;