import re

with open('src/AppGroup.jsx', 'r') as f:
    content = f.read()

# 1. State replacements
content = re.sub(
    r'const \[location1, setLocation1\] = .*?\n  const \[location2, setLocation2\] = .*?;',
    '''const [locations, setLocations] = useState(() => {
    try {
      const locs = location.state?.locations || new URLSearchParams(window.location.search).get('locations');
      if (locs) return typeof locs === 'string' ? JSON.parse(locs) : locs;
    } catch(e) { console.error(e); }
    return [];
  });''',
    content,
    flags=re.DOTALL
)
content = re.sub(
    r'const \[location1Coords, setLocation1Coords\] = useState\(null\);\n  const \[location2Coords, setLocation2Coords\] = useState\(null\);',
    '',
    content
)

# 2. auto-trigger conditions
content = re.sub(
    r'const hasValidLocations = \(location1 \|\| location1InputRef\.current\?\.value\) && \n.*?\(location2 \|\| location2InputRef\.current\?\.value\);',
    'const hasValidLocations = locations && locations.length >= 2;',
    content
)
content = re.sub(
    r'const hasParams = location1 && location2;',
    'const hasParams = locations && locations.length >= 2;',
    content
)

# 3. Handle Search
handle_search_replacement = '''
  const handleSearch = async (e) => {
    e.preventDefault();

    const searchState = {
      locations: JSON.stringify(locations),
      searchMode,
      travelMode,
      placeType,
      radius: searchRadius,
      margin: timeDifferenceMargin
    };

    if (location.pathname !== '/venues-group') {
      navigate('/venues-group', { state: searchState });
    } else {
      navigate('/venues-group', { replace: true, state: searchState });
    }

    setLoading(true);
    setError("");
    setInvitationDraft("");
    setInvitationError("");
    setCurrentPage(1);
    setIsDetailedView(false);
    setDetailedPlaceId(null);

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
      const requestPayload = {
        locations,
        searchMode,
        travelMode,
        departureTime,
        placeType,
      };

      if (searchMode === 'time') {
        requestPayload.timeDifferenceMargin = timeDifferenceMargin;
      } else {
        requestPayload.searchRadius = searchRadius;
      }

      const response = await fetch(
        "http://localhost:8080/api/find_midway_multiple",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMidwayRestaurants(data);
        setIsSidebarOpen(true);
      } else {
        setError(data.error || `Server error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };
'''

# Find handleSearch and replace it
content = re.sub(
    r'const handleSearch = async \(e\) => \{.*?(?=  // Fetch places)',
    handle_search_replacement,
    content,
    flags=re.DOTALL
)
# Actually the regex might be tricky. Let's just do a simpler replacement for handleSearch.
content = re.sub(
    r'  // Search function\n  const handleSearch = async \(e\) => \{.*?\n  \};\n',
    '  // Search function\n' + handle_search_replacement,
    content,
    flags=re.DOTALL
)

# 4. showMarkersForAllPlaces
show_all_markers = '''
  const showMarkersForAllPlaces = () => {
    if (!map || !directionsService || !directionsRenderer) return;

    if (midwayRestaurants.length === 0) return;

    markers.forEach((m) => m.setMap(null));
    polylines.forEach((p) => p.setMap(null));
    setPolylines([]);

    const newMarkers = [];
    const bounds = new window.google.maps.LatLngBounds();

    const first = midwayRestaurants[0];
    if (first.travel_details) {
      first.travel_details.forEach((td, index) => {
        const coords = { lat: td.original_lat, lng: td.original_lon };
        const marker = new window.google.maps.Marker({
          position: coords,
          map,
          title: `Location ${index + 1}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#0B57D0",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
            scale: 18
          },
          label: {
            text: String.fromCharCode(65 + index),
            color: "white",
            fontWeight: "bold",
            fontSize: "14px"
          }
        });
        newMarkers.push(marker);
        bounds.extend(coords);
      });
    }

    const infoWindow = new window.google.maps.InfoWindow();

    midwayRestaurants.forEach((restaurant) => {
      const coords = { lat: restaurant.lat, lng: restaurant.lon };
      const marker = new window.google.maps.Marker({
        position: coords,
        map,
        title: restaurant.name,
        icon: { 
          url: "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2224%22%20height%3D%2234%22%20viewBox%3D%220%200%2024%2034%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12%200C5.373%200%200%205.373%200%2012c0%208.5%2012%2022%2012%2022s12-13.5%2012-22C24%205.373%2018.627%200%2012%200zm0%2016c-2.209%200-4-1.791-4-4s1.791-4%204-4%204%201.791%204%204-1.791%204-4%204z%22%20fill%3D%22%23994100%22%2F%3E%3C%2Fsvg%3E",
          scaledSize: new window.google.maps.Size(24, 34),
          anchor: new window.google.maps.Point(12, 34)
        }
      });

      marker.addListener("click", () => {
        setDetailedPlaceId(restaurant.place_id); 
        setIsDetailedView(true);
      });

      newMarkers.push(marker);
      bounds.extend(coords);
    });

    setMarkers(newMarkers);
    map.fitBounds(bounds);
    window.google.maps.event.trigger(map, "resize");
  };
'''

content = re.sub(
    r'  // Helper function to show all markers and routes\n  const showMarkersForAllPlaces = \(\) => \{.*?(?=\n  // // Helper function)',
    show_all_markers,
    content,
    flags=re.DOTALL
)

# 5. showMarkerForPlace
show_one_marker = '''
  const showMarkerForPlace = (placeId) => {
    const selected = midwayRestaurants.find((p) => p.place_id === placeId);
    if (!map || !selected || !directionsService) return;

    markers.forEach((m) => m.setMap(null));
    polylines.forEach((p) => p.setMap(null));
    setPolylines([]);

    const newMarkers = [];
    const selectedPlaceCoords = { lat: selected.lat, lng: selected.lon };

    const selectedMarker = new window.google.maps.Marker({
      position: selectedPlaceCoords,
      map,
      title: selected.name,
      icon: { 
        url: "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2224%22%20height%3D%2234%22%20viewBox%3D%220%200%2024%2034%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M12%200C5.373%200%200%205.373%200%2012c0%208.5%2012%2022%2012%2022s12-13.5%2012-22C24%205.373%2018.627%200%2012%200zm0%2016c-2.209%200-4-1.791-4-4s1.791-4%204-4%204%201.791%204%204-1.791%204-4%204z%22%20fill%3D%22%23b31b25%22%2F%3E%3C%2Fsvg%3E",
        scaledSize: new window.google.maps.Size(28, 40),
        anchor: new window.google.maps.Point(14, 40)
      }
    });
    newMarkers.push(selectedMarker);

    const lineSymbol = { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 };

    const getRoutePath = (origin, destination) => {
      return new Promise((resolve) => {
        directionsService.route({
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING
        }, (result, status) => {
          if (status === "OK" && result.routes && result.routes.length > 0) {
            resolve(result.routes[0].overview_path);
          } else {
            resolve([origin, destination]);
          }
        });
      });
    };

    if (selected.travel_details) {
      const promises = selected.travel_details.map((td, index) => {
        const coords = { lat: td.original_lat, lng: td.original_lon };
        const marker = new window.google.maps.Marker({
          position: coords,
          map,
          title: `Location ${index + 1}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#0B57D0",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
            scale: 18
          },
          label: {
            text: String.fromCharCode(65 + index),
            color: "white",
            fontWeight: "bold",
            fontSize: "14px"
          }
        });
        newMarkers.push(marker);
        return getRoutePath(coords, selectedPlaceCoords);
      });

      Promise.all(promises).then((paths) => {
        const newPolylines = paths.map((path, index) => {
          return new window.google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#0B57D0',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            map: map
          });
        });
        setPolylines(prev => {
          prev.forEach(p => p.setMap(null));
          return newPolylines;
        });
      });
    }

    setMarkers(newMarkers);
    map.setCenter(selectedPlaceCoords);
    map.setZoom(16);
  };
'''

content = re.sub(
    r'  // Helper function to show only the selected place marker with route\n  const showMarkerForPlace = \(placeId\) => \{.*?(?=\n  // Update map based on detailed view state)',
    show_one_marker,
    content,
    flags=re.DOTALL
)

# 6. Map update effect
content = re.sub(
    r'\(location1Coords && location2Coords\)',
    '(locations && locations.length >= 2)',
    content
)
content = re.sub(
    r', location1Coords, location2Coords,',
    ', locations,',
    content
)

# Replace <Header> references to location1 and location2
content = re.sub(
    r'<Header[\s\S]*?/>',
    '<Header />',
    content
)

# Replace the input layout at the top of the map overlay. 
# It currently references location1 and location2, location1InputRef, etc.
# We will just remove it or render a generic one because GroupSearchBar is in Dashboard.
# Wait, AppGroup also has LocationSelector for top inputs.
# Let's just remove the LocationSelector from the UI for AppGroup for now, or replace it with a simple button to go back.
content = re.sub(
    r'<div className="w-full flex md:hidden items-center gap-2 mb-4">.*?</div>',
    '',
    content,
    flags=re.DOTALL
)
content = re.sub(
    r'<div className="hidden md:flex relative flex-1 items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-200">.*?</div>\n\s*<div className="hidden md:flex relative flex-1 items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-200">.*?</div>',
    '<div className="hidden md:flex relative flex-1 items-center">Group Search Active</div>',
    content,
    flags=re.DOTALL
)

with open('src/AppGroup.jsx', 'w') as f:
    f.write(content)

print("Done")
