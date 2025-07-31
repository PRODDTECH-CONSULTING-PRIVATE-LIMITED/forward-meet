import React, { useState, useEffect, useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GooglePlaceCard from "./components/GooglePlacesCard";
import GooglePlaceCardCompact from "./components/GooglePlacesCardCompact";

// Main App component
const App = () => {
  // ALL HOOKS AT THE TOP - NEVER AFTER CONDITIONAL RETURNS
  // State variables for input locations, search results, loading status, and errors
  const [showFilters, setShowFilters] = useState(true);
  const [location1, setLocation1] = useState("");
  const [location2, setLocation2] = useState("");
  const [midwayRestaurants, setMidwayRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invitationDraft, setInvitationDraft] = useState("");
  const [generatingInvitation, setGeneratingInvitation] = useState(false);
  const [invitationError, setInvitationError] = useState("");
  const [searchMode, setSearchMode] = useState("time");
  const [searchRadius, setSearchRadius] = useState(7);
  const [userLocation, setUserLocation] = useState(null);
  const [showGeolocationPrompt, setShowGeolocationPrompt] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedTime, setSelectedTime] = useState(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    return now.toTimeString().slice(0, 5);
  });
  const [placeType, setPlaceType] = useState("restaurant");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Refs
  const mapRef = useRef(null);
  const location1InputRef = useRef(null);
  const location2InputRef = useRef(null);

  // Map state
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  // Image viewer state
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Library loading state
  const [placesLoaded, setPlacesLoaded] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [isDetailedView, setIsDetailedView] = useState(false);
  const [detailedPlaceId, setDetailedPlaceId] = useState(null);

  // Check for library loading
  useEffect(() => {
    const checkLibraries = async () => {
      if (window.google && window.google.maps?.importLibrary) {
        await window.google.maps.importLibrary("places");
        setPlacesLoaded(true);
      }
      if (window.google && window.google.maps?.Map) {
        setMapsLoaded(true);
      }
    };

    const interval = setInterval(checkLibraries, 200);
    return () => clearInterval(interval);
  }, []);

  // Get user location and initialize map
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setShowGeolocationPrompt(false);
          },
          (err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
            setShowGeolocationPrompt(true);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        setShowGeolocationPrompt(true);
      }
    };

    getUserLocation();

    // Initialize map only when mapsLoaded is true
    if (mapsLoaded) {
      initMap();
    }

    return () => {
      markers.forEach((marker) => marker.setMap(null));
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    };
  }, [mapsLoaded]);

  // Initialize autocomplete
  useEffect(() => {
    if (mapsLoaded && window.google?.maps?.places) {
      console.log(
        "Google Maps Places library available. Initializing autocomplete."
      );
      if (userLocation) {
        initAutocomplete(true);
      } else {
        initAutocomplete(false);
      }
    }
  }, [userLocation, mapsLoaded]);

  // Function to initialize the Google Map
  const initMap = () => {
    if (mapRef.current && window.google?.maps?.Map) {
      const googleMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 5,
        mapId: "DEMO_MAP_ID",
      });
      setMap(googleMap);
      setDirectionsService(new window.google.maps.DirectionsService());
      setDirectionsRenderer(
        new window.google.maps.DirectionsRenderer({
          map: googleMap,
          suppressMarkers: true,
        })
      );
    }
  };

  // Function to initialize Google Places Autocomplete
  const initAutocomplete = (useBounds = true) => {
    if (window.google?.maps?.places) {
      const autocompleteOptions = {
        types: ["geocode", "establishment"],
        componentRestrictions: { country: ["in"] },
      };

      if (useBounds && userLocation) {
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

      // Autocomplete for Location 1
      if (location1InputRef.current) {
        const autocomplete1 = new window.google.maps.places.Autocomplete(
          location1InputRef.current,
          autocompleteOptions
        );
        autocomplete1.addListener("place_changed", () => {
          const place = autocomplete1.getPlace();
          if (place.formatted_address) {
            setLocation1(place.formatted_address);
          } else if (place.name) {
            setLocation1(place.name);
          }
        });
      }

      // Autocomplete for Location 2
      if (location2InputRef.current) {
        const autocomplete2 = new window.google.maps.places.Autocomplete(
          location2InputRef.current,
          autocompleteOptions
        );
        autocomplete2.addListener("place_changed", () => {
          const place = autocomplete2.getPlace();
          if (place.formatted_address) {
            setLocation2(place.formatted_address);
          } else if (place.name) {
            setLocation2(place.name);
          }
        });
      }
    }
  };

  // Helper function to show all markers and routes
  const showMarkersForAllPlaces = () => {
    if (!map || !directionsService || !directionsRenderer || midwayRestaurants.length === 0) return;

    // Clear old markers and routes
    markers.forEach((m) => m.setMap(null));
    directionsRenderer.setDirections({ routes: [] });

    const newMarkers = [];
    const firstRestaurant = midwayRestaurants[0];

    const loc1Coords = {
      lat: firstRestaurant.loc1_lat,
      lng: firstRestaurant.loc1_lon
    };
    const loc2Coords = {
      lat: firstRestaurant.loc2_lat,
      lng: firstRestaurant.loc2_lon
    };

    const loc1Marker = new window.google.maps.Marker({
      position: loc1Coords,
      map,
      title: "Location 1",
      label: "1",
      icon: { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }
    });
    const loc2Marker = new window.google.maps.Marker({
      position: loc2Coords,
      map,
      title: "Location 2",
      label: "2",
      icon: { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }
    });

    newMarkers.push(loc1Marker, loc2Marker);

    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(loc1Coords);
    bounds.extend(loc2Coords);

    midwayRestaurants.forEach((restaurant, index) => {
      const coords = { lat: restaurant.lat, lng: restaurant.lon };
      const marker = new window.google.maps.Marker({
        position: coords,
        map,
        title: restaurant.name,
        label: String.fromCharCode(65 + index),
        icon: { url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }
      });
      newMarkers.push(marker);
      bounds.extend(coords);
    });

    setMarkers(newMarkers);
    map.fitBounds(bounds);

    // Display route
    directionsService.route({
      origin: loc1Coords,
      destination: loc2Coords,
      waypoints: [{
        location: { lat: firstRestaurant.lat, lng: firstRestaurant.lon },
        stopover: true
      }],
      travelMode: "DRIVING",
    }, (res, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(res);
      } else {
        console.error("Directions request failed due to " + status);
        setError("Could not display route on map: " + status);
      }
    });
  };

  // Helper function to show only the selected place marker
  const showMarkerForPlace = (placeId) => {
    const selected = midwayRestaurants.find((p) => p.place_id === placeId);
    if (!map || !selected) return;

    // Clear existing markers and routes
    markers.forEach((m) => m.setMap(null));
    if (directionsRenderer) directionsRenderer.setDirections({ routes: [] });

    const marker = new window.google.maps.Marker({
      position: { lat: selected.lat, lng: selected.lon },
      map,
      title: selected.name,
      icon: { url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }
    });

    setMarkers([marker]);
    map.setCenter({ lat: selected.lat, lng: selected.lon });
    map.setZoom(16);
  };

  // Update map based on detailed view state
  useEffect(() => {
    if (isDetailedView && detailedPlaceId) {
      showMarkerForPlace(detailedPlaceId);
    } else if (!isDetailedView && midwayRestaurants.length > 0) {
      showMarkersForAllPlaces();
    }
  }, [isDetailedView, detailedPlaceId, midwayRestaurants, map, directionsService, directionsRenderer]);

  // Image viewer functions
  const openImageViewer = (images, index = 0) => {
    setViewerImages(images);
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  const handlePrevImage = (placeIndex) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [placeIndex]: Math.max((prev[placeIndex] || 0) - 1, 0),
    }));
  };

  const handleNextImage = (placeIndex) => {
    const place = midwayRestaurants[placeIndex];
    const maxIndex = place.photo_references
      ? place.photo_references.length - 1
      : 0;
    setCurrentImageIndex((prev) => ({
      ...prev,
      [placeIndex]: Math.min((prev[placeIndex] || 0) + 1, maxIndex),
    }));
  };

  // Search function
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMidwayRestaurants([]);
    setInvitationDraft("");
    setInvitationError("");
    setCurrentPage(1);
    setIsDetailedView(false);
    setDetailedPlaceId(null);

    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
    }

    let departureTime = null;
    const currentTravelMode = "driving";
    if (currentTravelMode === "driving" && selectedDate && selectedTime) {
      const dateTimeString = `${selectedDate}T${selectedTime}:00`;
      const selectedDateTime = new Date(dateTimeString);
      if (selectedDateTime.getTime() > Date.now()) {
        departureTime = Math.floor(selectedDateTime.getTime() / 1000);
      } else {
        departureTime = Math.floor(Date.now() / 1000);
      }
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/find_midway_restaurant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location1,
            location2,
            searchMode,
            searchRadius,
            travelMode: currentTravelMode,
            departureTime,
            placeType,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMidwayRestaurants(data);
        setShowFilters(false);
      } else {
        setError(
          data.error ||
            `Server error: ${response.status} ${response.statusText}`
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError(
          "Failed to connect to the server. Please ensure the backend is running and accessible at http://localhost:8080."
        );
      } else {
        setError(
          `An unexpected error occurred: ${err.message}. Please check console for details.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate invitation function
  const generateInvitation = async (place) => {
    setGeneratingInvitation(true);
    setInvitationDraft("");
    setInvitationError("");

    if (!place) {
      setInvitationError("No place selected to generate an invitation.");
      setGeneratingInvitation(false);
      return;
    }

    try {
      const payload = {
        place_name: place.name,
        place_address: place.address,
        travel_time_from_loc1: place.travel_time_from_loc1_min,
        travel_time_from_loc2: place.travel_time_from_loc2_min,
        location1_name: location1,
        location2_name: location2,
      };

      const response = await fetch(
        "http://localhost:8080/api/generate_invitation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setInvitationDraft(data.invitation);
      } else {
        setInvitationError(
          data.error ||
            `Failed to generate invitation: ${response.status} ${response.statusText}`
        );
      }
    } catch (err) {
      console.error("Fetch error for invitation generation:", err);
      setInvitationError(
        "Failed to connect to the LLM server. Please ensure the backend is running."
      );
    } finally {
      setGeneratingInvitation(false);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = midwayRestaurants.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(midwayRestaurants.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Don't render until libraries are loaded
  if (!placesLoaded || !mapsLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading maps...</p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we initialize Google Maps
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid h-screen bg-gray-100"
      style={{ gridTemplateColumns: "30% 70%" }}
    >
      {/* LEFT PANEL: Search Form and Results Cards */}
      <div className="min-w-[350px] max-w-full h-screen bg-white shadow-xl overflow-y-auto border-r">
        <div className="p-6 w-full">
          {/* Header */}
          <div className="text-center mb-6 w-full">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Midway Place Finder
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              Find the perfect meeting spot between two locations
            </p>
          </div>

          {!showFilters && midwayRestaurants.length > 0 && (
            <div className="mb-4 flex justify-center">
              <button
                className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                onClick={() => setShowFilters(true)}
              >
                Edit Search
              </button>
            </div>
          )}

          {showGeolocationPrompt && (
            <div
              className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg"
              role="alert"
            >
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-amber-400 mt-0.5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-amber-800 text-sm mb-1">
                    Location Access Recommended
                  </p>
                  <p className="text-amber-700 text-xs">
                    Enable location access for better autocomplete suggestions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {showFilters && (
            <div
              className={`transition-all duration-300 ${
                showFilters
                  ? "opacity-100 max-h-[5000px]"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              <form onSubmit={handleSearch} className="space-y-4 w-full">
                {/* Location Inputs */}
                <div className="space-y-4 w-full">
                  <div className="w-full">
                    <label
                      htmlFor="location1"
                      className="block text-gray-700 text-sm font-semibold mb-2"
                    >
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Starting Location
                      </span>
                    </label>
                    <input
                      type="text"
                      id="location1"
                      ref={location1InputRef}
                      className="w-full py-3 px-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white transition-all duration-200"
                      value={location1}
                      onChange={(e) => setLocation1(e.target.value)}
                      placeholder="e.g., Jayanagar, Bengaluru"
                      autoComplete="off"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location2"
                      className="block text-gray-700 text-sm font-semibold mb-2"
                    >
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                        Destination Location
                      </span>
                    </label>
                    <input
                      type="text"
                      id="location2"
                      ref={location2InputRef}
                      className="w-full py-3 px-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white transition-all duration-200"
                      value={location2}
                      onChange={(e) => setLocation2(e.target.value)}
                      placeholder="e.g., Indiranagar, Bengaluru"
                      autoComplete="off"
                      required
                    />
                  </div>
                </div>

                {/* Place Type Selection */}
                <div>
                  <label
                    htmlFor="placeType"
                    className="block text-gray-700 text-sm font-semibold mb-2"
                  >
                    <span className="flex items-center">
                      What type of place?
                    </span>
                  </label>
                  <select
                    id="placeType"
                    value={placeType}
                    onChange={(e) => setPlaceType(e.target.value)}
                    className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:bg-white transition-all duration-200 text-gray-700 font-medium"
                  >
                    <option value="restaurant">🍽️ Restaurant</option>
                    <option value="cafe">☕ Coffee Shop</option>
                    <option value="bar">🍺 Bar</option>
                    <option value="night_club">🎵 Night Club</option>
                    <option value="establishment">🏢 Any Establishment</option>
                    <option value="co_working_space">
                      💼 Co-working Space
                    </option>
                  </select>
                </div>

                {/* Search Mode */}
                <div className="bg-gray-50 p-4 rounded-xl border">
                  <p className="text-gray-700 font-semibold mb-3 text-sm">
                    Optimize search by:
                  </p>
                  <div className="flex gap-6">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-blue-600"
                        name="searchMode"
                        value="time"
                        checked={searchMode === "time"}
                        onChange={(e) => setSearchMode(e.target.value)}
                      />
                      <span className="ml-2 text-gray-700 text-sm font-medium">
                        ⏱️ Time
                      </span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-purple-600"
                        name="searchMode"
                        value="distance"
                        checked={searchMode === "distance"}
                        onChange={(e) => setSearchMode(e.target.value)}
                      />
                      <span className="ml-2 text-gray-700 text-sm font-medium">
                        📏 Distance
                      </span>
                    </label>
                  </div>
                </div>

                {/* Traffic Prediction */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-gray-700 font-semibold mb-3 text-sm">
                    ⏰ Traffic Prediction (Driving Only)
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="selectedDate"
                        className="block text-gray-600 text-xs font-semibold mb-1"
                      >
                        Date:
                      </label>
                      <input
                        type="date"
                        id="selectedDate"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full py-2 px-3 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="selectedTime"
                        className="block text-gray-600 text-xs font-semibold mb-1"
                      >
                        Time:
                      </label>
                      <input
                        type="time"
                        id="selectedTime"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full py-2 px-3 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Search Radius */}
                <div>
                  <label
                    htmlFor="searchRadius"
                    className="block text-gray-700 text-sm font-semibold mb-3"
                  >
                    <span className="flex items-center justify-between">
                      <span>🎯 Search Radius</span>
                      <span className="text-green-600 font-bold">
                        {searchRadius} km
                      </span>
                    </span>
                  </label>
                  <input
                    type="range"
                    id="searchRadius"
                    min="1"
                    max="50"
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${
                        (searchRadius / 50) * 100
                      }%, #e5e7eb ${(searchRadius / 50) * 100}%, #e5e7eb 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1km</span>
                    <span>50km</span>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span>Find Midway Places</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {error && (
            <div
              className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg"
              role="alert"
            >
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-semibold text-red-800 text-sm mb-1">
                    Error occurred
                  </p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] py-4">
              <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full mb-4"></div>
              <p className="text-blue-700 text-sm font-medium">
                Searching for nearby places...
              </p>
            </div>
          ) : midwayRestaurants.length > 0 ? (
            <>
              {/* Results Header */}
              <div className="mt-8 mb-4 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg w-full">
                <div className="flex items-center justify-between w-full overflow-hidden">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-green-800 text-sm">
                        {midwayRestaurants.length} Places Found!
                      </p>
                      <p className="text-green-700 text-xs">
                        Showing {indexOfFirstItem + 1} to{" "}
                        {Math.min(indexOfLastItem, midwayRestaurants.length)} of{" "}
                        {midwayRestaurants.length}
                      </p>
                    </div>
                  </div>

                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={midwayRestaurants.length}>All</option>
                  </select>
                </div>
              </div>

              {/* Detailed View */}
              {isDetailedView && (
                <GooglePlaceCard
                  placeId={detailedPlaceId}
                  setDetailedPlaceId={setDetailedPlaceId}
                  setIsDetailedView={setIsDetailedView}
                />
              )}

              {/* Restaurant Cards */}
              {!isDetailedView && currentItems.map((location, index) => (
                <div
                  key={location.place_id}
                  className="bg-gray-50 p-2 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => {
                    setIsDetailedView(true);
                    setDetailedPlaceId(location.place_id);
                  }}
                >
                  <GooglePlaceCardCompact
                    placeId={location.place_id}
                    locationInfo={location}
                  />
                </div>
              ))}

              {/* Pagination Controls */}
              {totalPages > 1 && !isDetailedView && (
                <div className="mt-6 bg-white rounded-lg shadow-md border border-gray-200 p-4">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-105"
                      }`}
                    >
                      Previous
                    </button>

                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-105"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : null}

          {invitationDraft && (
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <h3 className="text-lg font-bold text-blue-800 mb-2">
                Your Invitation Draft
              </h3>
              <div className="bg-white rounded-lg p-3 shadow-inner border border-blue-100">
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                  {invitationDraft}
                </p>
              </div>
            </div>
          )}

          {invitationError && (
            <div
              className="mt-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg"
              role="alert"
            >
              <p className="font-semibold text-red-800 text-sm mb-1">
                Invitation Error
              </p>
              <p className="text-red-700 text-sm">{invitationError}</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Google Map */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          height: "100vh",
          width: "calc(70vw - 2px)",
          zIndex: 1,
        }}
      >
        <div
          ref={mapRef}
          className="w-full h-full"
          style={{
            minHeight: "100vh",
            height: "100vh",
            width: "100%",
          }}
        >
          {/* Map loads here - CRITICAL: Both width and height must be set */}
        </div>
        {/* Map Status Indicator */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200 z-10">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              Map Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
