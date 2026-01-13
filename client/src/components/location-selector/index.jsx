import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import ParticipantCard from '../ParticipantCard';

const LocationSelector = ({ 
  location1, 
  location2, 
  setLocation1, 
  setLocation2, 
  location1InputRef, 
  location2InputRef,
  onInputsVisible,
  userLocation
}) => {
  const [tempLocation1, setTempLocation1] = useState(location1 || '');
  const [tempLocation2, setTempLocation2] = useState(location2 || '');

  // Initialize autocomplete for inline fields on mount
  useEffect(() => {
    // Sync internal state with props if they exist
    setTempLocation1(location1 || '');
    setTempLocation2(location2 || '');
    
    // Initialize autocomplete after a short delay to ensure refs are attached
    const timer = setTimeout(() => {
      initAutocomplete();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Sync autocomplete dropdown width with participant card width
  useEffect(() => {
    const syncDropdownWidth = () => {
      const pacContainers = document.querySelectorAll('.pac-container');
      const participantCards = document.querySelectorAll('.participant-card');
      
      if (pacContainers.length > 0 && participantCards.length > 0) {
        pacContainers.forEach(container => {
          // Get the width of the first participant card
          const card = participantCards[0];
          const cardWidth = card.offsetWidth;
          
          // Only set width, let Google Maps handle positioning
          container.style.width = `${cardWidth}px`;
        });
      }
    };

    // Create a MutationObserver to watch for the autocomplete dropdown being added
    const observer = new MutationObserver((mutations) => {
      // Only sync when .pac-container is actually added (not on every DOM change)
      const pacAdded = mutations.some(mutation => 
        Array.from(mutation.addedNodes).some(node => 
          node.classList && node.classList.contains('pac-container')
        )
      );
      
      if (pacAdded) {
        syncDropdownWidth();
      }
    });

    // Only observe direct children of body (not subtree) to reduce triggers
    observer.observe(document.body, {
      childList: true,
      subtree: false
    });

    // Sync on window resize
    window.addEventListener('resize', syncDropdownWidth);

    // Initial sync
    syncDropdownWidth();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncDropdownWidth);
    };
  }, []);

  // Initialize Google Places Autocomplete
  const initAutocomplete = () => {
    if (window.google?.maps?.places) {
      const autocompleteOptions = {
        types: ["geocode", "establishment"],
        componentRestrictions: { country: ["in"] },
      };

      if (userLocation) {
        const bounds = new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(
            userLocation.lat - 0.45,
            userLocation.lng - 0.45
          ),
          new window.google.maps.LatLng(
            userLocation.lat + 0.45,
            userLocation.lng + 0.45
          )
        );
        autocompleteOptions.bounds = bounds;
      }

      // Autocomplete for User A (Starting Location)
      if (location1InputRef.current) {
        const autocomplete1 = new window.google.maps.places.Autocomplete(
          location1InputRef.current,
          autocompleteOptions
        );
        autocomplete1.addListener("place_changed", () => {
          const place = autocomplete1.getPlace();
          const value = place.formatted_address || place.name || "";
          setTempLocation1(value);
          setLocation1(value);
        });
      }

      // Autocomplete for User B (Destination Location)
      if (location2InputRef.current) {
        const autocomplete2 = new window.google.maps.places.Autocomplete(
          location2InputRef.current,
          autocompleteOptions
        );
        autocomplete2.addListener("place_changed", () => {
          const place = autocomplete2.getPlace();
          const value = place.formatted_address || place.name || "";
          setTempLocation2(value);
          setLocation2(value);
        });
      }
    }
  };
  // test

  return (
    <div className="space-y-3 w-full">
      <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        📍 Meeting Participants
      </label>
      
      <ParticipantCard
        label="Person A"
        value={tempLocation1}
        onChange={(e) => {
          setTempLocation1(e.target.value);
          setLocation1(e.target.value);
        }}
        placeholder="e.g., Jayanagar, Bengaluru"
        avatarClass="person-a"
        onClear={() => {
          setTempLocation1('');
          setLocation1('');
        }}
        inputRef={location1InputRef}
      />

      <ParticipantCard
        label="Person B"
        value={tempLocation2}
        onChange={(e) => {
          setTempLocation2(e.target.value);
          setLocation2(e.target.value);
        }}
        placeholder="e.g., Indiranagar, Bengaluru"
        avatarClass="person-b"
        onClear={() => {
          setTempLocation2('');
          setLocation2('');
        }}
        inputRef={location2InputRef}
      />
    </div>
  );
};

export default LocationSelector;