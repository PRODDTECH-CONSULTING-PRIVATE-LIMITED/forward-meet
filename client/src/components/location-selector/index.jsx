import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

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

  return (
    <div className="space-y-4 w-full">
      <div className="w-full">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Starting Location
          </span>
        </label>
        <div className="relative">
          <input
            ref={location1InputRef}
            type="text"
            placeholder="e.g., Jayanagar, Bengaluru"
            value={tempLocation1}
            onChange={(e) => {
              setTempLocation1(e.target.value);
              setLocation1(e.target.value);
            }}
            className="w-full py-3 px-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all duration-200 font-medium"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="w-full">
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          <span className="flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Destination Location
          </span>
        </label>
        <div className="relative">
          <input
            ref={location2InputRef}
            type="text"
            placeholder="e.g., Indiranagar, Bengaluru"
            value={tempLocation2}
            onChange={(e) => {
              setTempLocation2(e.target.value);
              setLocation2(e.target.value);
            }}
            className="w-full py-3 px-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all duration-200 font-medium"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;