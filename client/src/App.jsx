import React, { useState, useEffect, useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GooglePlaceCard from "./components/GooglePlacesCard";
import GooglePlaceCardCompact from "./components/GooglePlacesCardCompact";
import Header from "./components/header/Index";
import LocationSelector from "./components/location-selector";
import TrafficPrediction from "./components/TrafficPrediction";
import ParticipantCard from "./components/ParticipantCard";
import VenueTypeSelector from "./components/VenueTypeSelector";
import SegmentedControl from "./components/SegmentedControl";
import SearchRadiusSlider from "./components/SearchRadiusSlider";
import TimeDifferenceSlider from "./components/TimeDifferenceSlider";
import TravelModeSelector from "./components/TravelModeSelector";
import VenueResultsSidebar from "./components/VenueResultsSidebar";

// Main App component
const App = (props) => {
  // ALL HOOKS AT THE TOP - NEVER AFTER CONDITIONAL RETURNS
  // State variables for input locations, search results, loading status, and errors
  const [showFilters, setShowFilters] = useState(true);
  const [location1, setLocation1] = useState("");
  const [location2, setLocation2] = useState("");
  const [location1Coords, setLocation1Coords] = useState(null);
  const [location2Coords, setLocation2Coords] = useState(null);
  const [midwayRestaurants, setMidwayRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invitationDraft, setInvitationDraft] = useState("");
  const [generatingInvitation, setGeneratingInvitation] = useState(false);
  const [invitationError, setInvitationError] = useState("");
  const [searchMode, setSearchMode] = useState("time");
  const [searchRadius, setSearchRadius] = useState(2);
  const [timeDifferenceMargin, setTimeDifferenceMargin] = useState(10);
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
  const [travelMode, setTravelMode] = useState("driving");
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

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredVenueId, setHoveredVenueId] = useState(null);
  
  // Track initial mount to avoid triggering search on first render
  const isInitialMount = useRef(true);

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

  // Get user location
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
  }, []);

  // Initialize map when mapsLoaded is true
  useEffect(() => {
    if (mapsLoaded) {
      initMap();
    }

    return () => {
      markers.forEach((marker) => marker.setMap(null));
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    };
  }, [mapsLoaded, userLocation]);

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

  // Auto-trigger search when searchMode, searchRadius, or timeDifferenceMargin changes
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Only trigger if we have valid locations
    const hasValidLocations = (location1 || location1InputRef.current?.value) && 
                               (location2 || location2InputRef.current?.value);
    
    if (hasValidLocations && !loading) {
      // Trigger search with the new parameters
      handleSearch({ preventDefault: () => {} });
    }
  }, [searchMode, searchRadius, timeDifferenceMargin]); // Watch all filter changes

const cleanMapStyles = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "poi.government", stylers: [{ visibility: "off" }] },
  { featureType: "poi.medical", stylers: [{ visibility: "off" }] },
  { featureType: "poi.place_of_worship", stylers: [{ visibility: "off" }] },
  { featureType: "poi.school", stylers: [{ visibility: "off" }] },
  { featureType: "poi.sports_complex", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", stylers: [{ visibility: "off" }] },
  { featureType: "poi.attraction", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "transit.station", stylers: [{ visibility: "off" }] },
  { featureType: "transit.line", stylers: [{ visibility: "off" }] },
];

const initMap = async () => {
  if (mapRef.current && window.google?.maps?.Map) {
    let initialCenter = { lat: 20.5937, lng: 78.9629 }; // Default to India center
    let initialZoom = 5;
    
    // Manual city center coordinates that align with Google Maps labels
    const cityCenters = {
      'Bengaluru': { lat: 12.9716, lng: 77.5946, zoom: 11 },
      'Bangalore': { lat: 12.9716, lng: 77.5946, zoom: 11 },
      'Mumbai': { lat: 19.0760, lng: 72.8777, zoom: 11 },
      'Delhi': { lat: 28.7041, lng: 77.1025, zoom: 11 },
      'Hyderabad': { lat: 17.3850, lng: 78.4867, zoom: 11 },
      'Chennai': { lat: 13.0827, lng: 80.2707, zoom: 11 },
      'Kolkata': { lat: 22.5726, lng: 88.3639, zoom: 11 },
      'Pune': { lat: 18.5204, lng: 73.8567, zoom: 11 }
    };
    
    // If user location is available, get the city center
    if (userLocation && window.google?.maps?.Geocoder) {
      try {
        const geocoder = new window.google.maps.Geocoder();
        const response = await geocoder.geocode({
          location: { lat: userLocation.lat, lng: userLocation.lng }
        });
        
        if (response.results && response.results.length > 0) {
          // Find the locality (city) component
          const cityResult = response.results.find(result => 
            result.types.includes('locality') || result.types.includes('administrative_area_level_2')
          );
          
          if (cityResult) {
            // Extract city name
            const cityName = cityResult.address_components?.find(
              comp => comp.types.includes('locality')
            )?.long_name;
            
            console.log('Detected city:', cityName);
            
            // Check if we have manual coordinates for this city
            if (cityName && cityCenters[cityName]) {
              console.log('Using manual coordinates for', cityName);
              initialCenter = { lat: cityCenters[cityName].lat, lng: cityCenters[cityName].lng };
              initialZoom = cityCenters[cityName].zoom;
            } else if (cityName && cityResult.geometry && cityResult.geometry.location) {
              // Use Places API as fallback for cities not in our manual list
            

              // Create a temporary map to use PlacesService
              const tempMap = new window.google.maps.Map(mapRef.current, {
                center: { lat: userLocation.lat, lng: userLocation.lng },
                zoom: 11
              });
              
              const service = new window.google.maps.places.PlacesService(tempMap);
              
              // Search for the city to get better centered coordinates
              const searchPromise = new Promise((resolve) => {
                service.textSearch(
                  {
                    query: cityName,
                    type: 'locality'
                  },
                  (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
                      resolve({
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                      });
                    } else {
                      // Fallback to geocoder result
                      resolve({
                        lat: cityResult.geometry.location.lat(),
                        lng: cityResult.geometry.location.lng()
                      });
                    }
                  }
                );
              });
              
              initialCenter = await searchPromise;
              initialZoom = 11;
            } else if (cityResult.geometry && cityResult.geometry.location) {
              initialCenter = {
                lat: cityResult.geometry.location.lat(),
                lng: cityResult.geometry.location.lng()
              };
              initialZoom = 11;
            } else {
              // Fallback to user location if city not found
              initialCenter = { lat: userLocation.lat, lng: userLocation.lng };
              initialZoom = 11;
            }
          } else {
            // Fallback to user location if city not found
            initialCenter = { lat: userLocation.lat, lng: userLocation.lng };
            initialZoom = 11;
          }
        }
      } catch (error) {
        console.warn('Geocoding failed, using user location:', error);
        initialCenter = { lat: userLocation.lat, lng: userLocation.lng };
        initialZoom = 11;
      }
    }
    
    const googleMap = new window.google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      // clickableIcons: false,
      styles: cleanMapStyles
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
          if (place.geometry && place.geometry.location) {
            setLocation1Coords({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
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
          if (place.geometry && place.geometry.location) {
            setLocation2Coords({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
          }
        });
      }
    }
  };

  // Helper function to show all markers and routes
  const showMarkersForAllPlaces = () => {
    if (!map || !directionsService || !directionsRenderer) return;

    // Use specific coordinates if available, fallback to restaurants[0] for backward compatibility
    let loc1 = location1Coords;
    let loc2 = location2Coords;

    if (midwayRestaurants.length > 0) {
      const first = midwayRestaurants[0];
      if (!loc1) loc1 = { lat: first.loc1_lat, lng: first.loc1_lon };
      if (!loc2) loc2 = { lat: first.loc2_lat, lng: first.loc2_lon };
    }

    if (!loc1 || !loc2) return;

    // Clear old markers
    markers.forEach((m) => m.setMap(null));
    // directionsRenderer.setDirections({ routes: [] }); // Prevent flickering by not clearing routes before redrawing

    const newMarkers = [];
    const loc1Marker = new window.google.maps.Marker({
      position: loc1,
      map,
      title: "Location 1",
      label: "1",
      icon: { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }
    });
    const loc2Marker = new window.google.maps.Marker({
      position: loc2,
      map,
      title: "Location 2",
      label: "2",
      icon: { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }
    });

    newMarkers.push(loc1Marker, loc2Marker);

    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(loc1);
    bounds.extend(loc2);

    const infoWindow = new window.google.maps.InfoWindow();

    midwayRestaurants.forEach((restaurant, index) => {

      const coords = { lat: restaurant.lat, lng: restaurant.lon };
      // const marker = new window.google.maps.Marker({
      //   position: coords,
      //   map,
      //   title: restaurant.name,
      //   label: String.fromCharCode(65 + index),
      //   icon: { url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }
      // });

      //new marker
      const marker = new window.google.maps.Marker({
        position: coords,
        map,
        title: restaurant.name,
        label: String.fromCharCode(65 + index),
        icon: { 
          url: "/placeholder.png" ,
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 40)
        }
      });

      //// on hover focus sidebar card ////
      marker.addListener("mouseover", () => {
        setHoveredVenueId(restaurant.place_id);
      });

      // Clear focus on mouseout
      marker.addListener("mouseout", () => {
        setHoveredVenueId(null);
      });    

      // marker.addListener("mouseover", () => {
      //   const content = `
      //     <div style="max-width:220px">
      //       <strong>${restaurant.name}</strong><br/>
      //       ${restaurant.address || ""}<br/>
      //       ${restaurant.rating ? `⭐ ${restaurant.rating}` : ""}
      //     </div>
      //   `;
      //   infoWindow.setContent(content);
      //   infoWindow.open(map, marker);
      // });

      // marker.addListener("mouseout", () => {
      //   infoWindow.close();
      // });

      console.log("Restaurant Data:", restaurant);

      marker.addListener("click", () => {
        // console.log("Restaurant Data:", restaurant);
        setDetailedPlaceId(restaurant.place_id); 
        setIsDetailedView(true);
      });

      newMarkers.push(marker);
      bounds.extend(coords);
    });

    setMarkers(newMarkers);
    map.fitBounds(bounds);

    window.google.maps.event.trigger(map, "resize");

    // Display route
    const routeOptions = {
      origin: loc1,
      destination: loc2,
      travelMode: "DRIVING",
    };
    
    if (midwayRestaurants.length > 0) {
      routeOptions.waypoints = [{
        location: { lat: midwayRestaurants[0].lat, lng: midwayRestaurants[0].lon },
        stopover: true
      }];
    }
    
    directionsService.route(routeOptions, (res, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(res);
      } else {
        console.error("Directions request failed due to " + status);
        setError("Could not display route on map: " + status);
      }
    });
  };

  // // Helper function to show only the selected place marker
  // const showMarkerForPlace = (placeId) => {
  //   const selected = midwayRestaurants.find((p) => p.place_id === placeId);
  //   if (!map || !selected) return;

  //   // Clear existing markers and routes
  //   markers.forEach((m) => m.setMap(null));
  //   if (directionsRenderer) directionsRenderer.setDirections({ routes: [] });

  //   const marker = new window.google.maps.Marker({
  //     position: { lat: selected.lat, lng: selected.lon },
  //     map,
  //     title: selected.name,
  //     icon: { url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }
  //   });

  //   setMarkers([marker]);
  //   map.setCenter({ lat: selected.lat, lng: selected.lon });
  //   map.setZoom(16);
  // };
 
  // Helper function to show only the selected place marker with route
  const showMarkerForPlace = (placeId) => {
    const selected = midwayRestaurants.find((p) => p.place_id === placeId);
    if (!map || !selected || !directionsService || !directionsRenderer) return;

    // Clear existing markers and routes
    markers.forEach((m) => m.setMap(null));
    // directionsRenderer.setDirections({ routes: [] }); // Prevent flickering by not clearing routes before redrawing

    const newMarkers = [];

    // Coordinates for the locations
    const loc1Coords = {
      lat: selected.loc1_lat,
      lng: selected.loc1_lon
    };
    const loc2Coords = {
      lat: selected.loc2_lat,
      lng: selected.loc2_lon
    };
    const selectedPlaceCoords = {
      lat: selected.lat,
      lng: selected.lon
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

    const selectedMarker = new window.google.maps.Marker({
      position: selectedPlaceCoords,
      map,
      title: selected.name,
      icon: { url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" }
    });

    newMarkers.push(loc1Marker, loc2Marker, selectedMarker);
    setMarkers(newMarkers);
    map.setCenter({ lat: selected.lat, lng: selected.lon });
    map.setZoom(16);

   // Display route through the selected place
    directionsService.route({
      origin: loc1Coords,
      destination: loc2Coords,
      waypoints: [{
        location: selectedPlaceCoords,
        stopover: true
      }],
      travelMode: "DRIVING",
    }, (result, status) => {
      if (status === "OK") {
        const currentCenter = map.getCenter();
        const currentZoom = map.getZoom();
        
        directionsRenderer.setDirections(result);
        setTimeout(() => {
          map.setCenter(currentCenter);
          map.setZoom(currentZoom);
        }, 20);
      } else {
        console.error("Directions request failed due to " + status);
        setError("Could not display route on map: " + status);
      }
    });
  };

  // Update map based on detailed view state
  useEffect(() => {
    if (isDetailedView && detailedPlaceId) {
      showMarkerForPlace(detailedPlaceId);
    } else if (!isDetailedView && (midwayRestaurants.length > 0 || (location1Coords && location2Coords))) {
      showMarkersForAllPlaces();
    } else if (map && midwayRestaurants.length === 0 && userLocation) {
      // Show user's city when no search results
      map.setCenter({ lat: userLocation.lat, lng: userLocation.lng });
      map.setZoom(12);
      // Clear any existing markers and routes
      markers.forEach((m) => m.setMap(null));
      // if (directionsRenderer) {
      //   directionsRenderer.setDirections({ routes: [] });
      // }
    }
  }, [isDetailedView, detailedPlaceId, midwayRestaurants, location1Coords, location2Coords, map, directionsService, directionsRenderer, userLocation]);

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
    // setMidwayRestaurants([]); // Preserve markers while loading
    setInvitationDraft("");
    setInvitationError("");
    setCurrentPage(1);
    setIsDetailedView(false);
    setDetailedPlaceId(null);

    // if (directionsRenderer) {
    //   directionsRenderer.setDirections({ routes: [] });
    // }

    let departureTime = null;
    if (travelMode === "driving" && selectedDate && selectedTime) {
      const dateTimeString = `${selectedDate}T${selectedTime}:00`;
      const selectedDateTime = new Date(dateTimeString);
      if (selectedDateTime.getTime() > Date.now()) {
        departureTime = Math.floor(selectedDateTime.getTime() / 1000);
      } else {
        departureTime = Math.floor(Date.now() / 1000);
      }
    }

    try {
      // Build the request payload conditionally based on searchMode
      const requestPayload = {
        location1: location1InputRef.current?.value || location1,
        location2: location2InputRef.current?.value || location2,
        searchMode,
        travelMode,
        departureTime,
        placeType,
      };

      // Add the appropriate parameter based on searchMode
      if (searchMode === 'time') {
        requestPayload.timeDifferenceMargin = timeDifferenceMargin;
      } else {
        requestPayload.searchRadius = searchRadius;
      }

      const response = await fetch(
        "http://localhost:8080/api/find_midway_restaurant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMidwayRestaurants(data);
        setIsSidebarOpen(true); // Automatically open sidebar when results are loaded
        // setShowFilters(false);
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

  // Auto-switch page when hovering over a map marker
  useEffect(() => {
    if (hoveredVenueId) {
      const index = midwayRestaurants.findIndex(v => v.place_id === hoveredVenueId);
      if (index !== -1) {
        const pageOfVenue = Math.floor(index / itemsPerPage) + 1;
        if (pageOfVenue !== currentPage) {
          setCurrentPage(pageOfVenue);
        }
      }
    }
  }, [hoveredVenueId, midwayRestaurants, itemsPerPage, currentPage]);

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
      className="grid h-screen bg-slate-50"
      style={{ gridTemplateColumns: "minmax(480px, 30%) 1fr" }}
    >
      {/* LEFT PANEL: Search Form and Results Cards */}
      <div className="h-screen bg-white shadow-2xl overflow-y-auto border-r border-slate-100 relative z-10">
        <div className="p-8 w-full" style={{paddingTop: "0px"}}>
          {/* Header */}
          {/* <div className="text-center mb-6 w-full">
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
          </div> */}
          <Header />

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
              className={`transition-all duration-300 flex flex-col gap-16 mt-12 ${
                showFilters
                  ? "opacity-100 max-h-[5000px]"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
                <LocationSelector
                  location1={location1}
                  location2={location2}
                  setLocation1={setLocation1}
                  setLocation2={setLocation2}
                  location1InputRef={location1InputRef}
                  location2InputRef={location2InputRef}
                  userLocation={userLocation}
                  onInputsVisible={() => {
                    // Re-initialize autocomplete when inputs become visible
                    if (userLocation) {
                      initAutocomplete(true);
                    } else {
                      initAutocomplete(false);
                    }
                  }}
                /> 
                <TrafficPrediction 
                  {...props} 
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                />

                {/* Travel Mode Selection */}
                <TravelModeSelector
                  selected={travelMode}
                  onSelect={setTravelMode}
                />

                {/* Venue Type Selection */}
                <VenueTypeSelector
                  selected={placeType}
                  onSelect={setPlaceType}
                />

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full mt-14 primary-button py-5 px-8"
                  disabled={loading}
                  onClick={handleSearch}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                          strokeWidth={2.5}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span>Find Midway Places</span>
                    </>
                  )}
                </button>
              {/* </form> */}
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
              {/* <div className="mt-8 mb-4 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg w-full">
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
              </div> */}

              {/* Detailed View */}
              {/* {isDetailedView && (
                <GooglePlaceCard
                  placeId={detailedPlaceId}
                  setDetailedPlaceId={setDetailedPlaceId}
                  setIsDetailedView={setIsDetailedView}
                />
              )} */}

              {/* Restaurant Cards */}
              {/* {!isDetailedView && currentItems.map((location, index) => (
              <div
                id={`place-${location.place_id}`} // for scrolling from marker
                key={location.place_id}
                className="bg-gray-50 p-2 rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onMouseEnter={() => {
                  markers.forEach((marker) => {
                    marker.setIcon(
                      marker.place_id === location.place_id
                        ? "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
                        : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                    );
                  });
                }}
                onMouseLeave={() => {
                  markers.forEach((marker) => {
                    marker.setIcon("http://maps.google.com/mapfiles/ms/icons/red-dot.png");
                  });
                }}
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
            ))} */}

              {/* Pagination handled in Sidebar */}
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
        
        {/* Venue Results Sidebar */}
        {(midwayRestaurants.length > 0 || loading) && (
          <VenueResultsSidebar
            venues={currentItems}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            onVenueHover={(placeId) => setHoveredVenueId(placeId)}
            onVenueClick={(placeId) => {
              setDetailedPlaceId(placeId);
              setIsDetailedView(true);
            }}
            selectedVenueId={detailedPlaceId}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalResults={midwayRestaurants.length}
            hoveredVenueId={hoveredVenueId}
            itemsPerPage={itemsPerPage}
            loading={loading}
            searchMode={searchMode}
            onSearchModeChange={setSearchMode}
            searchRadius={searchRadius}
            onSearchRadiusChange={setSearchRadius}
            timeDifferenceMargin={timeDifferenceMargin}
            onTimeDifferenceMarginChange={setTimeDifferenceMargin}
          />
        )}
        
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